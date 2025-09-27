<body dir="rtl">
  <div class="page body">
    <div class="bordered grow header-item-data header-summary">
      <img height="64px" src="{{{store_logo}}}" alt="{{{store_name}}}" />
      <div class="header-summary__title">
        <div class="header-summary__plan">طرح رفاه کالا</div>
        <div class="header-summary__invoice">پیش فاکتور / {{{invoice_title}}}</div>
      </div>
      <div class="header-summary__meta">
        <div class="header-summary__meta-label">تاریخ خرید</div>
        <div class="date_digit">{{{order_date_created}}}</div>
      </div>
      <div if="show_qr_code_id" id="invoice_qrcode"></div>
    </div>
    <div if="watermark" style="opacity: {{{watermark_opacity_10}}};filter: alpha(opacity={{{watermark_opacity}}});" data-opacity="{{{watermark_opacity}}}" class="watermark"></div>
    <table class="header-table" style="width: 100%; margin: 0;">
      <tr><td style="width: 1.8cm;"></td><td></td><td style="width: 4.5cm !important;"></td></tr>
      <tr class="show_invoices_id_barcode_colspan">
        <td style="width: 1.8cm; height: 2.5cm;vertical-align: middle;padding-bottom: 4px;">
          <div class="header-item-wrapper">
            <div class="portait">{{{trnslt__seller}}}</div>
          </div>
        </td>
        <td colspan="{{{show_invoices_id_barcode_colspan}}}" style="padding: 0 4px 4px;height: 2.5cm;">
          <div class="bordered grow header-item-data">
            <table class="grow centered">
              <tr>
                <td style="width: 7cm">
                  <span class="label">فروشنده:</span> {{{store_name}}}
                </td>
                <td if="show_store_national_id" style="width: 5cm">
                  <span class="label">شناسه ملی:</span> <span class='autodir'>{{{store_national_id}}}</span></td>
                <td if="show_store_registration_number">
                  <span class="label">شماره ثبت:</span> <span class='autodir'>{{{store_registration_number}}}</span></td>
                <td if="show_store_economical_number">
                  <span class="label">شماره اقتصادی:</span> <span class='autodir'>{{{store_economical_number}}}</span></td>
              </tr>
              <tr>
                <td colspan="2"><span class="label">نشانی شرکت:</span> {{{store_address}}}</td>
                <td><span class="label">کدپستی:</span> <span class='autodir'>{{{store_postcode}}}</span></td>
                <td>
                  <span class="label">تلفن و فکس:</span> <span class='autodir'>{{{store_phone}}}</span></td>
              </tr>
            </table>
          </div>
        </td>
        <td if="show_invoices_id_barcode" style="width: 4.5cm;height: 2.5cm;padding: 0 0 4px;">
          <div class="bordered grow" style="display: flex;flex-wrap: nowrap;align-content: center;align-items: center;justify-content: center; gap:20px">
            <div class="flex" style="flex-direction: column;text-align: center;">
              <div class="font-small">شناسه پیش فاکتور </div>
              <div style="font-size:large;font-weight:bold;">{{{customer_uin}}}</div>
            </div>
          </div>
        </td>
      </tr>
      <tr class="">
        <td style="width: 1.8cm; height: 2.5cm;vertical-align: middle; padding: 0 0 4px">
          <div class="header-item-wrapper">
            <div class="portait" style="margin: 20px">{{{trnslt__buyer}}}</div>
          </div>
        </td>
        <td class='shipping_ref_id' colspan="{{{show_shipping_ref_id_colspan}}}" style="height: 2.5cm;vertical-align: middle; padding: 0 4px 4px">
          <div class="bordered header-item-data">
            <table style="height: 100%" class="centered">
              <tr style="display:none">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
              <tr>
                <td style="width: 7cm"><span class="label">خریدار:</span> {{{customer_fullname}}}</td>
                <td style="width: 5cm"><span class="label">شرکت:</span> {{{customer_company}}}</td>
                <td colspan="2" if="show_user_uin"><span class="label">شماره‌ اقتصادی/کدملی:</span><span class='autodir'>{{{customer_uin}}}</span></td>
              </tr>
              <tr>
                <td style="width: 7cm" if="show_customer_phone">
                  <span class="label">شماره تماس:</span> <span class='autodir'>{{{customer_phone}}}</span>
                </td>
                <td if="show_customer_address">
                  <span class="label">کد پستی:</span> <span class='autodir'>{{{customer_postcode}}}</span>
                </td>
                <td  colspan="2" if="show_customer_email">
                  <span class="label">ایمیل:</span> <span class='autodir'>{{{customer_email}}}</span>
                </td>
              </tr>
              <tr if="show_customer_address">
                <td colspan="4">
                  <span class="label">نشانی:</span> {{{customer_address}}}</td>
                </tr>
            </table>
          </div>
        </td>
        <td if="show_shipping_ref_id" style="padding: 0 0 4px; height:2.5cm;">
          <div class="grow bordered" style="padding: 2mm 5mm;">
            <div class="flex" style="flex-direction: column;text-align: center">
              <div class="font-small">شماره پیش فاکتور</div>
              <div class="flex-grow font-medium">
                <img alt='{{{invoice_id_en}}}' class="barcode" style="width: 100%;height: auto;" src='{{{invoice_barcode}}}'/>{{{invoice_id_en}}}
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr if="show_sales_agent_details">
        <td style="width: 1.8cm; height: 2.5cm;vertical-align: middle; padding: 0 0 4px">
          <div class="header-item-wrapper">
            <div class="portait">{{{trnslt__sales_agent}}}</div>
          </div>
        </td>
        <td colspan="2" style="height: 2.5cm;vertical-align: middle; padding: 0 4px 4px">
          <div class="bordered header-item-data">
            <table style="height: 100%" class="centered">
              <tr style="display:none">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td style="width: 6cm"><span class="label">نام نماینده فروش:</span> {{{sales_agent_fullname}}}</td>
                <td style="width: 6cm"><span class="label">نام فروشگاه:</span> {{{sales_agent_store}}}</td>
                <td style="width: 4cm"><span class="label">تلفن:</span> <span class='autodir'>{{{sales_agent_phone}}}</span></td>
                <td style="width: 4cm"><span class="label">کد نماینده:</span> <span class='autodir'>{{{sales_agent_code}}}</span></td>
              </tr>
              <tr>
                <td colspan="4"><span class="label">نشانی:</span> {{{sales_agent_address}}}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    
    </table>
    <table class="content-table">
      <thead>
        <tr style="display:none">
          <th></th>
          
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr if="show_order_items">
            <th class="show_product_n" style="width: 1.8cm;">ردیف<div if="watermark" style="opacity: {{{watermark_opacity_10}}};filter: alpha(opacity={{{watermark_opacity}}});" data-opacity="{{{watermark_opacity}}}" class="watermark_print"></div></th>

            <th class="show_product_sku" if="show_product_sku">کد کالا</th>
            <th class="show_product_title_description" colspan="{{{product_description_colspan}}}">شرح کالا</th>
            <th class="show_product_qty">تعداد</th>
            <th class="show_product_weight" if="show_product_weight">وزن</th>
            <th class="show_product_dimensions" if="show_product_dimensions">ابعاد</th>
            <th class="show_product_base_price" style="width: 2.3cm">مبلغ واحد</th>
            <th class="show_discount_precent" if="show_discount_precent" style="width: 2.3cm">تخفیف</th>
            <th class="show_product_tax" if="show_product_tax" style="width: 2.3cm">مالیات</th>
            <th class="show_product_total_price" colspan="{{{product_nettotal_colspan}}}">جمع کل</th>
        </tr>
      </thead>
      <tbody>
        {{{invoice_products_list}}}
      </tbody>
      <tfoot>
        <tr if="show_order_total">
          <td colspan="{{{invoice_final_prices_pre_colspan}}}">جمع کل</td>
          <td if="show_product_qty">{{{invoice_total_qty}}}</td>
          <td if="show_product_weight">{{{invoice_total_weight}}}</td>
          <td colspan="{{{invoice_final_prices_colspan}}}">{{{invoice_final_prices}}}</td>
        </tr>
        <tr if="show_order_note">
          <td colspan="{{{invoice_final_row_colspan}}}">
            <table class="transp">
              <tr>{{{invoice_notes}}}</tr>
            </table>
          </td>
        </tr>
        <tr if="show_signature" style="background: #fff">
          <td colspan="{{{invoice_final_row_colspan}}}" style="vertical-align: top">
            <div class="flex">
              <div class="flex-grow">مهر و امضای فروشنده:<br>
                <img class="footer-img uk-align-center" alt="" style="width:150px; {{{signature_css}}}" src="{{{signature}}}">
              </div>
              <div class="flex-grow">مهر و امضای خریدار:<br>
                <img class="footer-img uk-align-center" alt="" style="width:150px; {{{customer_signature_css}}}" src="{{{customer_signature}}}">
              </div>
            </div>
          </td>
        </tr>
        <tr if="show_custom_footer">
          <td colspan="{{{invoice_final_row_colspan}}}">{{{invoices_footer}}}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</body>
