<?php
/**
 * Plugin Name: افزونه درگاه پرداخت رفاه کالا ویژه سپر الکتریک
 * Plugin URI:  https://sepehrelectric.ir/
 * Description: افزودن درگاه پرداخت رفاه کالا به ووکامرس مشابه درگاه پرداخت پرداخت در محل (COD).
 * Version:     1.0.0
 * Author:      Sephehr Electric
 * Author URI:  https://sepehrelectric.ir/
 * Text Domain: refahkala-gateway
 * Domain Path: /languages
 *
 * RefahKala Payment Gateway for WooCommerce.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register the gateway once WooCommerce is loaded.
 */
function refahkala_gateway_init() {
    if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
        return;
    }

    class WC_Gateway_RefahKala extends WC_Payment_Gateway {
        /**
         * Constructor.
         */
        public function __construct() {
            $this->id                 = 'refahkala_gateway';
            $this->icon               = '';
            $this->has_fields         = false;
            $this->method_title       = __( 'RefahKala Payment Gateway', 'refahkala-gateway' );
            $this->method_description = __( 'Offline payment gateway for RefahKala similar to Cash on Delivery.', 'refahkala-gateway' );
            $this->supports           = array( 'products' );

            $this->init_form_fields();
            $this->init_settings();

            $this->title        = $this->get_option( 'title' );
            $this->description  = $this->get_option( 'description' );
            $this->instructions = $this->get_option( 'instructions' );
            $this->logo_url     = $this->get_option( 'logo_url' );
            $this->method_title = $this->get_option( 'admin_title', $this->method_title );

            add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
            add_action( 'woocommerce_thankyou_' . $this->id, array( $this, 'thankyou_page' ) );
            add_action( 'woocommerce_email_before_order_table', array( $this, 'email_instructions' ), 10, 3 );
            add_filter( 'woocommerce_gateway_icon', array( $this, 'filter_gateway_icon' ), 10, 2 );
        }

        /**
         * Initialize form fields for gateway settings.
         */
        public function init_form_fields() {
            $this->form_fields = array(
                'enabled'      => array(
                    'title'   => __( 'Enable/Disable', 'refahkala-gateway' ),
                    'type'    => 'checkbox',
                    'label'   => __( 'Enable RefahKala Payment Gateway', 'refahkala-gateway' ),
                    'default' => 'no',
                ),
                'admin_title'  => array(
                    'title'       => __( 'Admin Title', 'refahkala-gateway' ),
                    'type'        => 'text',
                    'description' => __( 'Title shown in the WooCommerce payment settings list.', 'refahkala-gateway' ),
                    'default'     => __( 'RefahKala Payment Gateway', 'refahkala-gateway' ),
                    'desc_tip'    => true,
                ),
                'title'        => array(
                    'title'       => __( 'Title', 'refahkala-gateway' ),
                    'type'        => 'text',
                    'description' => __( 'This controls the title which the user sees during checkout.', 'refahkala-gateway' ),
                    'default'     => __( 'پرداخت رفاه کالا', 'refahkala-gateway' ),
                    'desc_tip'    => true,
                ),
                'description'  => array(
                    'title'       => __( 'Description', 'refahkala-gateway' ),
                    'type'        => 'textarea',
                    'description' => __( 'Payment method description that the customer will see on your checkout.', 'refahkala-gateway' ),
                    'default'     => __( 'پرداخت سفارش شما از طریق درگاه رفاه کالا انجام خواهد شد.', 'refahkala-gateway' ),
                    'desc_tip'    => true,
                ),
                'instructions' => array(
                    'title'       => __( 'Instructions', 'refahkala-gateway' ),
                    'type'        => 'textarea',
                    'description' => __( 'Instructions that will be added to the thank you page and emails.', 'refahkala-gateway' ),
                    'default'     => __( 'لطفاً تا تکمیل فرایند پرداخت و تأیید سفارش صبور باشید.', 'refahkala-gateway' ),
                    'desc_tip'    => true,
                ),
                'logo_url'     => array(
                    'title'       => __( 'Logo URL', 'refahkala-gateway' ),
                    'type'        => 'text',
                    'description' => __( 'Provide a full URL to the logo displayed beside the gateway name during checkout.', 'refahkala-gateway' ),
                    'default'     => '',
                    'desc_tip'    => true,
                ),
            );
        }

        /**
         * Process the payment and return the result.
         *
         * @param int $order_id Order ID.
         * @return array
         */
        public function process_payment( $order_id ) {
            $order = wc_get_order( $order_id );

            if ( ! $order ) {
                return array(
                    'result'   => 'fail',
                    'redirect' => '',
                );
            }

            $order->update_status( 'on-hold', __( 'Awaiting RefahKala payment confirmation.', 'refahkala-gateway' ) );
            wc_reduce_stock_levels( $order_id );
            WC()->cart->empty_cart();

            return array(
                'result'   => 'success',
                'redirect' => $order->get_checkout_order_received_url(),
            );
        }

        /**
         * Output instructions on the thank you page.
         *
         * @param int $order_id Order ID.
         */
        public function thankyou_page( $order_id ) {
            if ( ! $this->instructions ) {
                return;
            }

            $order = wc_get_order( $order_id );

            if ( $order && $this->id === $order->get_payment_method() ) {
                echo wp_kses_post( wpautop( $this->instructions ) );
            }
        }

        /**
         * Add instructions to customer emails.
         *
         * @param WC_Order $order         Order object.
         * @param bool     $sent_to_admin Whether email is sent to admin.
         * @param bool     $plain_text    Whether email is plain text.
         */
        public function email_instructions( $order, $sent_to_admin, $plain_text ) {
            if ( ! $this->instructions || $sent_to_admin || ! $order instanceof WC_Order ) {
                return;
            }

            if ( $this->id !== $order->get_payment_method() ) {
                return;
            }

            if ( $plain_text ) {
                echo PHP_EOL . $this->instructions . PHP_EOL;
            } else {
                echo wp_kses_post( wpautop( $this->instructions ) );
            }
        }

        /**
         * Display a custom logo next to the gateway title during checkout.
         *
         * @param string $icon    Default icon HTML.
         * @param string $gateway_id Gateway ID.
         *
         * @return string
         */
        public function filter_gateway_icon( $icon, $gateway_id ) {
            if ( $this->logo_url && $this->id === $gateway_id ) {
                $logo = sprintf(
                    '<img src="%1$s" alt="%2$s" style="max-width: 64px; height: auto;" />',
                    esc_url( $this->logo_url ),
                    esc_attr( wp_strip_all_tags( $this->title ) )
                );

                return $icon . $logo;
            }

            return $icon;
        }

        /**
         * Display payment fields description on the checkout page.
         */
        public function payment_fields() {
            if ( $this->description ) {
                echo wpautop( wp_kses_post( $this->description ) );
            }
        }
    }

    /**
     * Add the gateway to WooCommerce.
     *
     * @param array $methods Existing payment methods.
     *
     * @return array
     */
    function refahkala_add_gateway( $methods ) {
        $methods[] = 'WC_Gateway_RefahKala';
        return $methods;
    }

    add_filter( 'woocommerce_payment_gateways', 'refahkala_add_gateway' );
}
add_action( 'plugins_loaded', 'refahkala_gateway_init', 11 );

/**
 * Load plugin textdomain.
 */
function refahkala_gateway_load_textdomain() {
    load_plugin_textdomain( 'refahkala-gateway', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'refahkala_gateway_load_textdomain' );
