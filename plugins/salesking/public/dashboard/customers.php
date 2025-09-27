<?php
    if (intval(apply_filters('salesking_enable_my_customers_page', 1)) === 1){
    ?>
    <div class="nk-content salesking_customers_page">
        <div class="container-fluid">
            <div class="nk-content-inner">
                <div class="nk-content-body">
                    <div class="nk-block-head nk-block-head-sm">
                        <div class="nk-block-between">
                            <div class="nk-block-head-content">
                                <h3 class="nk-block-title page-title"><?php esc_html_e('Customers','salesking');?></h3>
                                <div class="nk-block-des text-soft">
                                    <p><?php esc_html_e('Here you can view and manage your customers. Through the "Shop as Customer" button, you can place orders on behalf of customers.', 'salesking');?><br /><?php esc_html_e('By choosing the "pending payment" option at checkout, customers will be sent a payment link by email.', 'salesking');?></p>
                                </div>
                            </div><!-- .nk-block-head-content -->
                            <div class="nk-block-head-content">
                                <div class="toggle-wrap nk-block-tools-toggle">
                                    <a href="#" class="btn btn-icon btn-trigger toggle-expand mr-n1" data-target="more-options"><em class="icon ni ni-more-v"></em></a>
                                    <div class="toggle-expand-content" data-content="more-options">
                                        <ul class="nk-block-tools g-3">
                                            <li>
                                                <div class="form-control-wrap">
                                                    <div class="form-icon form-icon-right">
                                                        <em class="icon ni ni-search"></em>
                                                    </div>
                                                    <input type="text" class="form-control" id="salesking_customers_search" placeholder="<?php esc_html_e('Search customers...','salesking');?>">
                                                </div>
                                            </li>
                                            
                                            <?php
                                                if (apply_filters('salesking_default_add_customer', true)){
                                                    if (apply_filters('b2bking_show_customers_page_add_button', true)){
                                                        ?>
                                                        
                                                        <?php

                                                        require_once ( SALESKING_DIR . 'includes/class-salesking-helper.php' );
                                                        $helper = new Salesking_Helper();
                                                        if($helper->agent_can_add_more_customers($user_id)){
                                                            ?>
                                                            <li class="nk-block-tools-opt">
                                                                <a href="#" class="btn btn-icon btn-primary d-md-none" data-toggle="modal" data-target="#modal_add_customer"><em class="icon ni ni-plus"></em></a>
                                                                <button class="btn btn-primary d-none d-md-inline-flex" data-toggle="modal" data-target="#modal_add_customer"><em class="icon ni ni-plus"></em><span><?php esc_html_e('Add','salesking');?></span></button>
                                                            </li>
                                                            <?php
                                                        } else {
                                                            // show some error message that they reached the max nr of products
                                                            ?>
                                                            <button class="btn btn-primary d-none d-md-inline-flex" disabled="disabled"><em class="icon ni ni-plus"></em><span><?php esc_html_e('Add (Max Limit Reached)','salesking');?></span></button>

                                                            <?php
                                                        }
                                                    }
                                                } else {
                                                    do_action('salesking_alternative_add_customer');
                                                }
                                            ?>
                                        </ul>
                                    </div>
                                </div>
                            </div><!-- .nk-block-head-content -->
                        </div><!-- .nk-block-between -->
                    </div><!-- .nk-block-head -->
                    <table id="salesking_dashboard_customers_table" class="nk-tb-list is-separate mb-3">
                        <thead>
                            <tr class="nk-tb-item nk-tb-head">
                                <th class="nk-tb-col"><span class="sub-text"><?php esc_html_e('Customer','salesking'); ?></span></th>
                                <?php
                                    if (apply_filters('b2bking_show_customers_page_company_column', true)){
                                        ?>
                                        <th class="nk-tb-col tb-col-md"><span class="sub-text"><?php esc_html_e('Company','salesking'); ?></span></th>
                                        <?php
                                    }
                                ?>
                                <?php
                                do_action('salesking_customers_custom_columns_header');

                                    if (apply_filters('b2bking_show_customers_page_total_spent_column', true)){
                                        ?>
                                        <th class="nk-tb-col tb-col-md"><span class="sub-text"><?php esc_html_e('Total Spend','salesking'); ?></span></th>

                                        <?php
                                    }

                                ?>
                                <?php
                                    if (apply_filters('b2bking_show_customers_page_order_count_column', true)){
                                        ?>
                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text"><?php esc_html_e('Number of Orders','salesking'); ?></span></th>

                                        <?php
                                    }
                                ?>

                                <?php
                                    if (apply_filters('b2bking_show_customers_page_email_column', true)){
                                        ?>
                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text"><?php esc_html_e('Email','salesking'); ?></span></th>
                                        <?php
                                    }
                                ?>
                                <?php
                                    if (apply_filters('b2bking_show_customers_page_phone_column', true)){
                                        ?>
                                        <th class="nk-tb-col tb-col-lg"><span class="sub-text"><?php esc_html_e('Phone','salesking'); ?></span></th>
                                        <?php
                                    }
                                ?> 
                                <?php
                                    if (apply_filters('salesking_show_customers_page_actions_column', true)){
                                        ?>                          
                                        <th class="nk-tb-col"><?php esc_html_e('Actions','salesking'); ?></span></th>
                                        <?php
                                    }
                                ?> 
                            </tr>
                        </thead>
                        <tbody>
                            <?php


                            if (!apply_filters('salesking_load_customers_table_ajax', false)){

                                // get all customers of the user

                                // if all agents can shop for all customers
                                if(intval(get_option( 'salesking_all_agents_shop_all_customers_setting', 0 ))=== 1){
                                    // first get all customers that have this assigned agent individually
                                    $user_ids_assigned = get_users(array(
                                        'fields' => 'ids',
                                    ));
                                    $customers = $user_ids_assigned;

                                } else {

                                    // first get all customers that have this assigned agent individually
                                    $user_ids_assigned = get_users(array(
                                                'meta_key'     => 'salesking_assigned_agent',
                                                'meta_value'   => $user_id,
                                                'meta_compare' => '=',
                                                'fields' => 'ids',
                                            ));


                                    if (defined('B2BKING_DIR') || defined('B2BKINGCORE_DIR')){
                                        // now get all b2bking groups that have this assigned agent
                                        $groups_with_agent = get_posts(array( 'post_type' => 'b2bking_group',
                                                  'post_status'=>'publish',
                                                  'numberposts' => -1,
                                                  'fields' => 'ids',
                                                  'meta_query'=> array(
                                                        'relation' => 'OR',
                                                        array(
                                                            'key' => 'salesking_assigned_agent',
                                                            'value' => $user_id,
                                                            'compare' => '=',
                                                        ),
                                                    )));

                                    } else {
                                        $groups_with_agent = array();
                                    }

                                    if (!empty($groups_with_agent)){
                                        // get all customers in the above groups with agent
                                        $user_ids_in_groups_with_agent = get_users(array(
                                                    'meta_key'     => 'b2bking_customergroup',
                                                    'meta_value'   => $groups_with_agent,
                                                    'meta_compare' => 'IN',
                                                    'fields' => 'ids',
                                                ));

                                        // for all customers with this agent as group, make sure they don't have a different agent individually
                                        foreach ($user_ids_in_groups_with_agent as $array_key => $user_id){
                                            // check that a different agent is not assigned
                                            $assigned_agent = get_user_meta($user_id,'salesking_assigned_agent', true);

                                            if (!empty($assigned_agent) && $assigned_agent !== $user_id && $assigned_agent !== 'none'){
                                                unset($user_ids_in_groups_with_agent[$array_key]);
                                            }
                                        }


                                        $customers = array_merge($user_ids_assigned, $user_ids_in_groups_with_agent);
                                    } else {
                                        $customers = $user_ids_assigned;
                                    }

                                    if (apply_filters('salesking_include_subagent_customers', false)){

                                        // get all subagents of the user (all users with this user as parent)
                                        $subagents = get_users(array(
                                        'fields' => 'ids',
                                        'meta_query'=> array(
                                              'relation' => 'AND',
                                              array(
                                                'meta_key'     => 'salesking_group',
                                                'meta_value'   => 'none',
                                                'meta_compare' => '!=',
                                               ),
                                              array(
                                                  'key' => 'salesking_parent_agent',
                                                  'value' => get_current_user_id(),
                                                  'compare' => '=',
                                              ),
                                          )));


                                        foreach ($subagents as $subagent_id){
                                            $temp_users = get_users(array(
                                                        'meta_key'     => 'salesking_assigned_agent',
                                                        'meta_value'   => $subagent_id,
                                                        'meta_compare' => '=',
                                                        'fields' => 'ids',
                                                    ));


                                            if (!empty($temp_users)){
                                                $customers = array_merge($customers, $temp_users);
                                            }
                                        }
                                    }
                                }

                                // additional agents
                                if (apply_filters('salesking_use_additional_agents', false)){

                                    $additional_customers = array();
                                    $all_ids = get_users(array(
                                        'fields' => 'ids',
                                    ));

                                    foreach ($all_ids as $random_customer_id){
                                        $selected_options_string = get_user_meta($random_customer_id, 'salesking_additional_agents', true);
                                        $selected_options = explode(',', $selected_options_string);
                                        if (in_array(get_current_user_id(), $selected_options)){
                                            array_push($additional_customers, $random_customer_id);
                                        }
                                    }

                                    $customers = array_unique(array_filter(array_merge($customers, $additional_customers)));
                                }

                                $customers = apply_filters('salesking_customers_agent_dashboard', $customers, get_current_user_id());
                                
                                foreach ($customers as $customer_id){
                                    $customerobj = new WC_Customer($customer_id);
                                    $user_info = get_userdata($customer_id);
                                    $company_name = get_user_meta($customer_id,'billing_company', true);
                                    if (empty($company_name)){
                                        $company_name = '';
                                    }

                                    if (empty($user_info->first_name) && empty($user_info->last_name)){
                                        $name = $user_info->user_login;
                                    } else {
                                        $name = $user_info->first_name.' '.$user_info->last_name;
                                    }
                                    $name = apply_filters('salesking_customers_page_name_display', $name, $customer_id);

                                    ?>
                                    <tr class="nk-tb-item">
                                            <td class="nk-tb-col">
                                                <div>
                                                    <div class="user-card">
                                                        <div class="user-avatar bg-primary">
                                                            <span><?php echo esc_html(substr($name, 0, 2));?></span>
                                                        </div>
                                                        <div class="user-info">
                                                            <span class="tb-lead"><?php echo esc_html($name);?> <span class="dot dot-success d-md-none ml-1"></span></span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </td>
                                            <?php
                                                if (apply_filters('b2bking_show_customers_page_company_column', true)){
                                                    ?>
                                                    <td class="nk-tb-col tb-col-md">
                                                        <div>
                                                            <span><?php echo esc_html($company_name);?></span>
                                                        </div>
                                                    </td>
                                                    <?php
                                                }
                                            ?>
                                            <?php

                                            do_action('salesking_customers_custom_columns_content', $customerobj);

                                                if (apply_filters('b2bking_show_customers_page_total_spent_column', true)){
                                                    ?>
                                                    <td class="nk-tb-col tb-col-md" data-order="<?php echo esc_attr($customerobj->get_total_spent());?>">
                                                        <div>
                                                            <span class="tb-amount"><?php echo wc_price($customerobj->get_total_spent());?></span>
                                                        </div>
                                                    </td>
                                                    <?php
                                                }
                                            ?>
                                            <?php
                                                if (apply_filters('b2bking_show_customers_page_order_count_column', true)){
                                                    ?>
                                                    <td class="nk-tb-col tb-col-lg">
                                                        <div>
                                                            <?php
                                                            if (apply_filters('salesking_customers_show_orders_link', false)){
                                                                ?>
                                                                <a class="salesking_clickable_highlight" href="<?php echo esc_attr(trailingslashit(get_page_link(apply_filters( 'wpml_object_id', get_option( 'salesking_agents_page_setting', 'disabled' ), 'post' , true)))) .'orders/?search='.$user_info->user_email; ?>">
                                                                <?php
                                                            }
                                                            ?>

                                                            <span class="tb-amount"><?php echo $customerobj->get_order_count();?></span>
                                                            <?php

                                                            if (apply_filters('salesking_customers_show_orders_link', false)){
                                                                ?>
                                                                </a>
                                                                <?php
                                                            }
                                                            ?>
                                                        </div>
                                                    </td>
                                                    <?php
                                                }
                                            ?>
                                            
                                            
                                            <?php /*
                                            <td class="nk-tb-col tb-col-lg" data-order="<?php 
                                            $last_order = $customerobj->get_last_order();
                                            if (is_a($last_order, 'WC_Order')){
                                                $date = explode('T',$last_order->get_date_created())[0];
                                                echo esc_attr(strtotime($date));
                                            }
                                            ?>"> 
                                                <div>
                                                    <span><?php 
                                                    if (is_a($last_order, 'WC_Order')){
                                                        $date = ucfirst(date_i18n('F j, Y', strtotime($date)));

                                                        echo $date;
                                                    }?></span>
                                                </div>
                                            </td>
                                            */?>
                                            <?php
                                                if (apply_filters('b2bking_show_customers_page_email_column', true)){
                                                    ?>
                                                    <td class="nk-tb-col tb-col-lg">
                                                        <div>
                                                            <span><?php echo esc_html($user_info->user_email);?></span>
                                                        </div>
                                                    </td>
                                                    <?php
                                                }
                                            ?>
                                            <?php
                                                if (apply_filters('b2bking_show_customers_page_phone_column', true)){
                                                    ?>
                                                    <td class="nk-tb-col tb-col-lg"> 
                                                        <div >
                                                            <span><?php echo esc_html(get_user_meta($customer_id,'billing_phone', true));?></span>
                                                        </div>
                                                    </td>
                                                    <?php
                                                }
                                            ?>
                                            
                                            <?php
                                                if (apply_filters('salesking_show_customers_page_actions_column', true)){
                                                    if (!user_can( $customer_id, 'manage_woocommerce' ) && ! user_can( $customer_id, 'manage_options' ) ){

                                                        ?>  
                                                        <td class="nk-tb-col">
                                                            <div class="tb-odr-btns d-md-inline">
                                                                <button class="btn btn-sm btn-primary salesking_shop_as_customer" value="<?php echo esc_attr($customer_id);?>"><em class="icon ni ni-cart-fill"></em><span><?php esc_html_e('Shop as Customer','salesking');?></span></button>
                                                            </div>
                                                            <?php 
                                                            if (intval(get_option( 'salesking_agents_can_edit_customers_setting', 1 )) === 1){
                                                                ?>
                                                                <div class="tb-odr-btns d-none d-md-inline">
                                                                    <button class="btn btn-sm btn-secondary salesking_shop_as_customer_edit" value="<?php echo esc_attr($customer_id);?>"><em class="icon ni ni-pen-alt-fill"></em><span><?php echo apply_filters('salesking_shop_customer_edit_button_text', esc_html__('Edit','salesking'));?></span></button>
                                                                </div>
                                                                <?php
                                                            }
                                                            do_action('salesking_customers_action_buttons', $customer_id);
                                                            ?>
                                                        </td>
                                                        <?php
                                                    } else {
                                                        ?>
                                                        <td class="nk-tb-col">
                                                            <?php esc_html_e('No permission','salesking'); ?>
                                                        </td>
                                                        <?php
                                                    }
                                                }
                                            ?>
                                    </tr>
                                    <?php
                                }
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
   <!-- ---------------------------------- -->
    <div class="modal fade" tabindex="-1" id="modal_add_customer">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><?php esc_html_e('Customer Info','salesking'); ?></h5>
                <a href="#" class="close" data-dismiss="modal" aria-label="Close">
                    <em class="icon ni ni-cross"></em>
                </a>
            </div>
            <div class="modal-body">
                <form action="#" class="form-validate is-alter" id="salesking_add_customer_form">
                    <div class="form-group">
                        <label class="form-label" for="first-name"><?php esc_html_e('First name','salesking'); ?></label>
                        <div class="form-control-wrap">
                            <input type="text" class="form-control" id="first-name" name="first-name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="last-name"><?php esc_html_e('Last name','salesking'); ?></label>
                        <div class="form-control-wrap">
                            <input type="text" class="form-control" id="last-name" name="last-name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="national-id"><?php esc_html_e('National ID','salesking'); ?></label>
                        <div class="form-control-wrap">
                            <input type="text" class="form-control" id="national-id" name="national-id" pattern="[0-9]{10}" required>
                            <small class="form-text text-muted" id="national-id-feedback"><?php esc_html_e('Enter a valid 10-digit Iranian National ID','salesking'); ?></small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="phone-no"><?php esc_html_e('Phone No','salesking'); ?></label>
                        <div class="form-control-wrap">
                            <input type="text" class="form-control" id="phone-no" name="phone-no" pattern="9[0-9]{9}" required>
                            <small class="form-text text-muted" id="phone-no-feedback"><?php esc_html_e('Enter a valid Iranian mobile number without 0 like 9123456789','salesking'); ?></small>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="button" id="salesking_add_customer" class="btn btn-lg btn-primary" disabled><?php esc_html_e('Add Customer','salesking'); ?></button>
                    </div>
                </form>
            </div>
            <div class="modal-footer bg-light">
            </div>
        </div>
    </div>
</div>
    <!-- ------------------------------------------ -->

    </div>
    <?php
}
?>