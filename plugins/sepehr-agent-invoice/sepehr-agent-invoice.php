<?php
/**
 * Plugin Name:       Sepehr Agent Invoice
 * Plugin URI:        https://example.com/
 * Description:       Extends Pepro Ultimate Invoice templates to include sales agent information on pre-invoices.
 * Version:           1.0.0
 * Author:            Sepehr Electric
 * Author URI:        https://example.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sepehr-agent-invoice
 * Domain Path:       /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('SEPEHR_AGENT_INVOICE_DIR')) {
    define('SEPEHR_AGENT_INVOICE_DIR', plugin_dir_path(__FILE__));
}

if (!defined('SEPEHR_AGENT_INVOICE_URL')) {
    define('SEPEHR_AGENT_INVOICE_URL', plugin_dir_url(__FILE__));
}

register_activation_hook(__FILE__, function () {
    update_option('sepehr_agent_invoice_activation_notice', 1, false);
});

add_action('admin_notices', function () {
    if (!current_user_can('manage_options')) {
        return;
    }
    if (!get_option('sepehr_agent_invoice_activation_notice')) {
        return;
    }
    echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__(
        'Sepehr Agent Invoice activated. Please choose the "Default Pre-Invoice + Agent" template for pre-invoices inside Pepro Ultimate Invoice settings.',
        'sepehr-agent-invoice'
    ) . '</p></div>';
    delete_option('sepehr_agent_invoice_activation_notice');
});

add_action('plugins_loaded', function () {
    add_filter('puiw_get_default_dynamic_params', 'sepehr_agent_invoice_inject_agent_details', 30, 2);
    add_filter('puiw_get_templates_list', 'sepehr_agent_invoice_register_template');
    add_filter('puiw_get_preinvoice_template', 'sepehr_agent_invoice_force_preinvoice_template', 10, 2);
});

/**
 * Append sales agent details to Pepro invoice dynamic data.
 *
 * @param array          $opts  Existing invoice options.
 * @param WC_Order|mixed $order WooCommerce order instance.
 *
 * @return array
 */
function sepehr_agent_invoice_inject_agent_details($opts, $order)
{
    if (!is_a($order, 'WC_Order')) {
        return $opts;
    }

    $opts['show_sales_agent_details'] = 'no';
    $opts['sales_agent_fullname'] = '';
    $opts['sales_agent_store'] = '';
    $opts['sales_agent_phone'] = '';
    $opts['sales_agent_address'] = '';
    $opts['sales_agent_code'] = '';
    $opts['trnslt__sales_agent'] = __('نماینده فروش', 'sepehr-agent-invoice');

    $agent_id = $order->get_meta('salesking_assigned_agent');
    $agent_name_meta = $order->get_meta('salesking_assigned_agent_name');
    $agent_code_meta = $order->get_meta('salesking_assigned_agent_code');

    $agent_user = $agent_id ? get_user_by('id', $agent_id) : false;

    $full_name = '';
    if ($agent_user) {
        $first_name = $agent_user->first_name;
        if (!$first_name) {
            $first_name = get_user_meta($agent_user->ID, 'first_name', true);
        }
        $last_name = $agent_user->last_name;
        if (!$last_name) {
            $last_name = get_user_meta($agent_user->ID, 'last_name', true);
        }
        $full_name = trim($first_name . ' ' . $last_name);
        if ('' === $full_name) {
            $full_name = $agent_user->display_name;
        }
    }

    if ('' === $full_name) {
        $full_name = is_string($agent_name_meta) ? trim($agent_name_meta) : '';
    }

    $store_name = '';
    $store_phone = '';
    $address_string = '';
    $agent_code = '';

    if ($agent_user) {
        $store_name = get_user_meta($agent_user->ID, 'agent_shop_name', true);
        $store_phone = get_user_meta($agent_user->ID, 'agent_shop_phone', true);

        $province = get_user_meta($agent_user->ID, 'agent_province', true);
        $city = get_user_meta($agent_user->ID, 'agent_city', true);
        $street = get_user_meta($agent_user->ID, 'agent_address', true);
        $postcode = get_user_meta($agent_user->ID, 'agent_postcode', true);

        $address_parts = array_filter(array_map('trim', array($province, $city, $street, $postcode)), 'strlen');
        if (!empty($address_parts)) {
            $address_string = implode('، ', $address_parts);
        }

        $agent_code = get_user_meta($agent_user->ID, 'salesking_agentid', true);
    }

    if ('' === $agent_code) {
        $agent_code = is_string($agent_code_meta) ? trim($agent_code_meta) : '';
    }

    $opts['sales_agent_fullname'] = $full_name;
    $opts['sales_agent_store'] = is_string($store_name) ? trim($store_name) : '';
    $opts['sales_agent_phone'] = is_string($store_phone) ? trim($store_phone) : '';
    $opts['sales_agent_address'] = $address_string;
    $opts['sales_agent_code'] = $agent_code;

    $required_fields = array(
        $opts['sales_agent_fullname'],
        $opts['sales_agent_store'],
        $opts['sales_agent_phone'],
        $opts['sales_agent_address'],
        $opts['sales_agent_code'],
    );

    if ('' !== implode('', $required_fields) && count(array_filter($required_fields)) === count($required_fields)) {
        $opts['show_sales_agent_details'] = 'yes';
    }

    return $opts;
}

/**
 * Register the custom template with Pepro Ultimate Invoice.
 *
 * @param array $templates Existing templates list.
 *
 * @return array
 */
function sepehr_agent_invoice_register_template($templates)
{
    $custom_template = trailingslashit(SEPEHR_AGENT_INVOICE_DIR . 'templates/preinvoice-agent') . 'default.cfg';
    if (file_exists($custom_template)) {
        $templates[] = $custom_template;
    }

    return $templates;
}

/**
 * Ensure the custom pre-invoice template is used when the default template is selected.
 *
 * @param string $template Current template path.
 * @param string $default  Default template slug.
 *
 * @return string
 */
function sepehr_agent_invoice_force_preinvoice_template($template, $default)
{
    $custom_directory = trailingslashit(SEPEHR_AGENT_INVOICE_DIR . 'templates/preinvoice-agent');
    if ('default-pre-invoice' === $default && file_exists($custom_directory . 'default.cfg')) {
        if ('default-pre-invoice' === basename($template)) {
            return untrailingslashit($custom_directory);
        }
    }

    return $template;
}
