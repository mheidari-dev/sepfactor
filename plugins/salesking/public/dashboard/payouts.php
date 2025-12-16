<?php
if (intval(get_option('salesking_enable_payouts_setting', 1)) === 1) {
?>
    <div class="nk-content salesking_payouts_page">
        <div class="container-fluid">
            <div class="nk-content-inner">
                <div class="nk-content-body">
                    <div class="components-preview wide-md mx-auto">
                        <div class="nk-block-head nk-block-head-sm">
                            <div class="nk-block-between">
                                <div class="nk-block-head-content">
                                    <h3 class="nk-block-title page-title"><?php esc_html_e('Payouts', 'salesking'); ?></h3>
                                    <div class="nk-block-des text-soft">
                                        <p><?php esc_html_e('View and keep track of your payouts.', 'salesking'); ?></p>
                                    </div>
                                </div><!-- .nk-block-head-content -->

                            </div><!-- .nk-block-between -->
                        </div><!-- .nk-block-head -->
                        <div class="nk-block">
                            <div class="row g-gs">
                                <div class="col-xxl-12">
                                    <div class="card text-white bg-primary">
                                        <div class="card-header"><?php esc_html_e('Available for Payout', 'salesking'); ?>
                                        </div>
                                        <div class="card-inner">
                                            <h5 class="card-title"><?php

                                                                    $outstanding_balance = get_user_meta($user_id, 'salesking_outstanding_earnings', true);
                                                                    if (empty($outstanding_balance)) {
                                                                        $outstanding_balance = 0;
                                                                    }
                                                                    echo wc_price($outstanding_balance);

                                                                    ?></h5>
                                            <p class="card-text">
                                                <?php esc_html_e('This is the amount you currently have in earnings, available for your next payout.', 'salesking'); ?>
                                            </p>
                                        </div>
                                    </div>
                                </div><!-- .col -->
                                
                                <div class="col-xxl-12">
                                    <div class="card card-full">
                                        <div class="card-inner">
                                            <div class="card-title-group">
                                                <div class="card-title">
                                                    <h6 class="title"><?php esc_html_e('Recent Payouts', 'salesking'); ?>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="nk-tb-list mt-n2">
                                            <div class="nk-tb-item nk-tb-head">
                                                <div class="nk-tb-col">
                                                    <span><?php esc_html_e('Amount', 'salesking'); ?></span>
                                                </div>
                                                <div class="nk-tb-col tb-col-sm">
                                                    <span><?php esc_html_e('Payment Method', 'salesking'); ?></span>
                                                </div>
                                                <div class="nk-tb-col tb-col-md">
                                                    <span><?php esc_html_e('Date Processed', 'salesking'); ?></span>
                                                </div>
                                                <div class="nk-tb-col"><span
                                                        class="d-none d-sm-inline"><?php esc_html_e('Notes', 'salesking'); ?></span>
                                                </div>
                                            </div>
                                            <?php
                                            $user_payout_history = sanitize_text_field(get_user_meta($user_id, 'salesking_user_payout_history', true));

                                            if ($user_payout_history) {
                                                $transactions = explode(';', $user_payout_history);
                                                $transactions = array_filter($transactions);
                                            } else {
                                                // empty, no transactions
                                                $transactions = array();
                                            }
                                            $transactions = array_reverse($transactions);
                                            foreach ($transactions as $transaction) {
                                                $elements = explode(':', $transaction);
                                                $date = $elements[0];
                                                $amount = $elements[1];
                                                $oustanding_balance = $elements[2];
                                                $note = $elements[3];
                                                $method = $elements[4];
                                            ?>
                                                <div class="nk-tb-item">
                                                    <div class="nk-tb-col">
                                                        <span class="tb-sub tb-amount"><?php echo wc_price($amount); ?></span>
                                                    </div>
                                                    <div class="nk-tb-col tb-col-sm">
                                                        <div class="user-card">
                                                            <div class="user-name">
                                                                <span class="tb-lead"><?php echo $method; ?></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="nk-tb-col tb-col-md">
                                                        <span class="tb-sub"><?php echo esc_html($date); ?></span>
                                                    </div>

                                                    <div class="nk-tb-col salesking_column_limited_width">
                                                        <span class="tb-sub"><?php echo esc_html($note); ?></span>
                                                    </div>
                                                </div>
                                            <?php
                                            }
                                            ?>
                                        </div>
                                    </div><!-- .card -->
                                </div>
                            </div>
                        </div><!-- .row -->
                    </div><!-- .nk-block -->
                </div>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" id="modal_set_payout_method">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><?php esc_html_e('Set Payout Method', 'salesking'); ?></h5>
                        <a href="#" class="close" data-dismiss="modal" aria-label="Close">
                            <em class="icon ni ni-cross"></em>
                        </a>
                    </div>
                    <div class="modal-body">
                        <form action="#" class="form-validate is-alter" id="salesking_set_payout_form">
                            <h6><?php esc_html_e('Select a payment method:', 'salesking'); ?></h6><br>
                            <?php
                            // get all configured methods: bank, custom

                            $bank = intval(get_option('salesking_enable_bank_payouts_setting', 0));
                            $custom = intval(get_option('salesking_enable_custom_payouts_setting', 0));
                            $title = get_option('salesking_enable_custom_payouts_title_setting', '');
                            $description = get_option('salesking_enable_custom_payouts_description_setting', '');

                            // get currently selected method if any
                            $selected = get_user_meta($user_id, 'salesking_agent_selected_payout_method', true);

                            if ($bank === 1) {
                            ?>
                                <div class="g mb-1">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" name="saleskingpayoutMethod"
                                            id="bankMethod" value="bank" <?php checked('bank', $selected, true); ?>>
                                        <label class="custom-control-label"
                                            for="bankMethod"><?php esc_html_e('Bank Transfer', 'salesking'); ?></label>
                                    </div>
                                </div>
                            <?php
                            }
                            if ($custom === 1) {
                            ?>
                                <div class="g mb-1">
                                    <div class="custom-control custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" name="saleskingpayoutMethod"
                                            id="customMethod" value="custom" <?php checked('custom', $selected, true); ?>>
                                        <label class="custom-control-label" for="customMethod"><?php

                                                                                                echo wp_kses(nl2br($title), array('br' => true, 'strong' => true, 'b' => true, 'a' => array(
                                                                                                    'href' => array(),
                                                                                                    'target' => array()
                                                                                                )));

                                                                                                ?></label>
                                    </div>
                                </div>
                            <?php
                            }
                            ?>
                            <br>
                            <?php
                            $info = base64_decode(get_user_meta($user_id, 'salesking_payout_info', true));
                            $info = explode('**&&', $info);


                            if ($bank === 1) {
                            ?>
                                <div class="form-group salesking_bank_info">
                                    <label class="form-label"
                                        for="bank-account-holder-name"><?php esc_html_e('Account Holder Name', 'salesking'); ?></label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control" id="bank-account-holder-name"
                                            name="bank-account-holder-name"
                                            value="<?php echo isset($info[1]) ? esc_attr($info[1]) : ''; ?>">
                                    </div>
                                </div>

                                <div class="form-group salesking_bank_info">
                                    <label class="form-label"
                                        for="bank-name"><?php esc_html_e('Bank Name', 'salesking'); ?></label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control" id="bank-name" name="bank-name"
                                            value="<?php echo isset($info[2]) ? esc_attr($info[2]) : ''; ?>">
                                    </div>
                                </div>

                                <div class="form-group salesking_bank_info">
                                    <label class="form-label"
                                        for="bank-branch-code"><?php esc_html_e('Bank Branch / Code', 'salesking'); ?></label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control" id="bank-branch-code" name="bank-branch-code"
                                            value="<?php echo isset($info[3]) ? esc_attr($info[3]) : ''; ?>">
                                    </div>
                                </div>

                                <div class="form-group salesking_bank_info">
                                    <label class="form-label"
                                        for="bank-account-number"><?php esc_html_e('Bank Account Number', 'salesking'); ?></label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control" id="bank-account-number"
                                            name="bank-account-number"
                                            value="<?php echo isset($info[4]) ? esc_attr($info[4]) : ''; ?>">
                                    </div>
                                </div>

                                <div class="form-group salesking_bank_info">
                                    <label class="form-label" for="bank-iban"><?php esc_html_e('IBAN', 'salesking'); ?></label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control" id="bank-iban" name="bank-iban"
                                            value="<?php echo isset($info[5]) ? esc_attr($info[5]) : ''; ?>">
                                    </div>
                                </div> <?php
                                    }


                                    if ($custom === 1) {

                                        ?>
                                <div class="form-group salesking_custom_info">
                                    <label class="form-label" for="paypal-email"><?php
                                                                                    echo wp_kses(nl2br($title), array('br' => true, 'strong' => true, 'b' => true, 'a' => array(
                                                                                        'href' => array(),
                                                                                        'target' => array()
                                                                                    )));
                                                                                    ?></label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control" id="custom-method" name="custom-method"
                                            placeholder="<?php echo esc_attr($description); ?>"
                                            value="<?php

                                                    if (isset($info[1])) {
                                                        echo esc_attr($info[1]);
                                                    }

                                                    ?>">
                                    </div>
                                </div>
                            <?php
                                    }
                            ?>
                            <div class="form-group">
                                <button type="button" id="salesking_save_payout"
                                    class="btn btn-lg btn-primary"><?php esc_html_e('Save Info', 'salesking'); ?></button>
                            </div>

                        </form>
                    </div>
                    <div class="modal-footer bg-light">
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php
}
?>