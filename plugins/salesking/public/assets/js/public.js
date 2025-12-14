/**
*
* JavaScript file that handles public side JS
*
*/
(function($){

	"use strict";

	$( document ).ready(function() {

		// Fix icons loading issue
		failsafeicons();
		setTimeout(function(){
			failsafeicons();
		}, 500);
		function failsafeicons(){
			if (jQuery('.ni-comments').val()!==undefined){
				if(getComputedStyle(document.querySelector('.ni-comments'), ':before').getPropertyValue('content') === '"î²Ÿ"'){
					reloaddashlite();
				}
			}
		}
		function reloaddashlite(){
			let hrnew = jQuery('#salesking_dashboard-css').attr('href')+1;
			jQuery('#salesking_dashboard-css').attr('href', hrnew);
		}

		// Move body to stay below top switched used bar
		setTimeout(function(){
			if ($('#salesking_agent_switched_bar').css('height') !== undefined){
				let heightpx = jQuery('#salesking_agent_switched_bar').css('height');
				jQuery('body').css('padding-top', heightpx);
			}
		}, 100);

		// set cookies via browser to ensure correct values
		function getParameterByName(name) {
	        const url = window.location.href;
	        name = name.replace(/[\[\]]/g, "\\$&");
	        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	              results = regex.exec(url);
	        if (!results) return null;
	        if (!results[2]) return '';
	        return decodeURIComponent(results[2].replace(/\+/g, " "));
	    }

	    function setCookie(name, value, days) {
	        const date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        const expires = "expires=" + date.toUTCString();
	        document.cookie = name + "=" + value + ";" + expires + ";path=/";
	    }

	    const regid = getParameterByName('regid');
	    const affid = getParameterByName('affid');

	    if (regid) {
	        setCookie('salesking_registration_cookie', regid, 1);
	        setCookie('salesking_affiliate_cookie', regid, 1);
	    } else if (affid) {
	        setCookie('salesking_registration_cookie', affid, 1);
	        setCookie('salesking_affiliate_cookie', affid, 1);
	    }
		
		
		// On clicking "Mark as read" for announcements
		$('#salesking_mark_announcement_read').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkread',
	            security: salesking_display_settings.security,
	            announcementid: $('#salesking_mark_announcement_read').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location = salesking_display_settings.announcementsurl;
			});
		});

		// On clicking "Mark all as read" for announcements
		$('#salesking_mark_all_announcement_read').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkallread',
	            security: salesking_display_settings.security,
	            announcementsid: $('#salesking_mark_all_announcement_read').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location = salesking_display_settings.announcementsurl;
			});
		});

		// clear initially to clear savestate
		setTimeout(function(){
			$('.salesking_earnings_page .form-control.form-control-sm, .salesking_customers_page .form-control.form-control-sm, .salesking_teams_page .form-control.form-control-sm, .salesking_orders_page .form-control.form-control-sm').val('').change().trigger('input');
		}, 200);

		// On clicking "Mark as read" for conversations
		$('#salesking_mark_conversation_read').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkreadmessage',
	            security: salesking_display_settings.security,
	            messageid: $('#salesking_mark_conversation_read').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location.reload();
			});
		});

		// On clicking "Mark as closed" for conversations
		$('#salesking_mark_conversation_closed').on('click', function(){
			// Run ajax request
			var datavar = {
	            action: 'saleskingmarkclosedmessage',
	            security: salesking_display_settings.security,
	            messageid: $('#salesking_mark_conversation_closed').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location.reload();
			});
		});



		// On click Send in existing conversation
		$('#salesking_dashboard_reply_message').on('click', function(){

			// Run ajax request
			var datavar = {
	            action: 'saleskingreplymessage',
	            security: salesking_display_settings.security,
	            messagecontent: $('#salesking_dashboard_reply_message_content').val(),
	            messageid: $(this).val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location.reload();
			});
		});

		// On clicking send (compose message)
		$('#salesking_compose_send_message').on('click', function(){

			// Run ajax request
			var datavar = {
	            action: 'saleskingcomposemessage',
	            security: salesking_display_settings.security,
	            messagecontent: $('#salesking_compose_send_message_content').val(),
	            recipient: $('#salesking_dashboard_recipient').val(),
	            title: $('#salesking_compose_send_message_title').val(),
	        };

			$.post(salesking_display_settings.ajaxurl, datavar, function(response){
				window.location = response;
			});
		});

		var buttonclass = 'btn btn-sm btn-gray';

		// Initiate customers frontend table

		if(salesking_display_settings.pdf_download_lang === 'chinese'){
			pdfMake.fonts = {
			  Noto: {
			    normal: 'Noto.ttf',
			    bold: 'Noto.ttf',
			    italics: 'Noto.ttf',
			    bolditalics: 'Noto.ttf'
			  }
			};
		}

		// OFFERS INTEGRATION START
		var mainTable = $('#salesking_dashboard_offers_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            stateSave: true,
            dom: 'Bfrtip',
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
		              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
		          } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});


		$('#salesking_offers_search').keyup(function(){
		      mainTable.search($(this).val()).draw() ;
		});

		// when page opens, check if quote is set (response to make offer)
		let params = (new URL(document.location)).searchParams;
		let quote = params.get('quote'); // is the string "Jonathan Smith".
		if (quote !== null && quote !== ''){
		    // we have a number
		    let quotenr = parseInt(quote);
		    setTimeout(function(){
		        $('.b2bking_salesking_new_offer').click();
		    }, 100);

		    // get values via AJAX and load into edit
		    // first run ajax call based on the offer id
		    var datavar = {
		        action: 'b2bking_get_offer_data_sk',
		        security: salesking_display_settings.security,
		        quoteid: quotenr
		    };

		    $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		       var results = response;
		       var resultsArray = results.split('*');
		       // load values into fields
		       $('#b2bking_admin_offer_textarea').val(resultsArray[2]);
		       $('#b2bking_category_users_textarea').val(resultsArray[0]);
		    
		        offerRetrieveHiddenField();
		        offerCalculateTotals();
		    });
		}

		// When New Offer modalzz is opened
		$('body').on('click', '.b2bking_salesking_new_offer', openOffermodalzz);
		function openOffermodalzz(){
		    clearOfferValues();
		    $('.b2bking_salesking_save_new_offer').val('new');
		    setTimeout(function(){
		        $('.b2bking_offer_product_selector').select2();
		    }, 200);
		}

		// Delete offer 
		$('body').on('click', '.b2bking_offer_delete_table', function(){
		    let offer = $(this).val();
		    if (confirm(salesking_display_settings.are_you_sure_delete_offer)){
		        var datavar = {
		            action: 'b2bking_delete_ajax_offer_sk',
		            security: salesking_display_settings.security,
		            offerid: offer,
		            userid: $('#b2bking_new_offer_user_id').val()
		        };
		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		           window.location.reload();
		        });
		    }
		});

		function clearOfferValues(){
		    $('.b2bking_salesking_email_offer').remove();
		    $('.b2bking_group_visibility_container_content_checkbox_input').prop('checked',false);
		    $('#b2bking_category_users_textarea').val('');
		    $('#b2bking_offer_customtext_textarea').val('');
		    $('#b2bking_new_offer_title').val('');
		    $('.b2bking_offer_line_number').each(function(){
		        // remove all except first
		        if ($(this).attr('ID') !== 'b2bking_offer_number_1'){
		            $(this).remove();
		        }
		        // clear first
		        $('#b2bking_offer_number_1 .b2bking_offer_text_input').val('');
		        $('#b2bking_offer_number_1 .b2bking_offer_product_selector').val('').trigger('change');
		        offerCalculateTotals();
		        offerSetHiddenField();
		    });
		}

		// Email Offer
		$('body').on('click', '.b2bking_salesking_email_offer', function(){
		    let offeridd = $(this).val();

		    if (confirm(salesking_display_settings.email_offer_confirm)){
		        var datavar = {
		            action: 'b2bking_email_offer_sk',
		            security: salesking_display_settings.security,
		            offerid: offeridd,
		            offerlink: salesking_display_settings.offers_endpoint_link,
		        };

		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		           
		           alert(salesking_display_settings.email_has_been_sent);
		        });
		    }
		});

		// Edit Offer
		$('body').on('click', '.b2bking_offer_edit_table', function (){
		    var offer_id = $(this).val();
		    // clear all values
		    clearOfferValues();
		    
		    setTimeout(function(){
		        // set button for save offer
		        $('.b2bking_salesking_save_new_offer').val(offer_id);

		        // add email offer button
		        $('.b2bking_salesking_save_new_offer').after('<button type="button" value="'+offer_id+'" class="btn btn-secondary salesking-btn salesking-btn-theme b2bking_salesking_email_offer">'+salesking_display_settings.email_offer+'</button>');
		      
		    }, 200);
		    // get values via AJAX and load into edit
		    // first run ajax call based on the offer id
		    var datavar = {
		        action: 'b2bking_get_offer_data_sk',
		        security: salesking_display_settings.security,
		        offerid: offer_id,
		        userid: $('#b2bking_new_offer_user_id').val()
		    };

		    $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		       var results = response;
		       var resultsArray = results.split('*');
		       // load values into fields
		       $('#b2bking_offer_customtext_textarea').val(resultsArray[3]);
		       $('#b2bking_admin_offer_textarea').val(resultsArray[2]);
		       $('#b2bking_category_users_textarea').val(resultsArray[0]);
		       $('#b2bking_new_offer_title').val(resultsArray[4]);
		        // foreach group visible
		        let groups = resultsArray[1].split(',');
		        groups.forEach((element) => {
		        	if (element !== ''){
	        		    $('#'+element).prop('checked', true);
		        	}
		        });
		        offerRetrieveHiddenField();
		        offerCalculateTotals();
		    });
		});

		// Save Offers
		$('.b2bking_salesking_save_new_offer').on('click', function(){
		    var vall = $(this).val();
		    if (!$('#b2bking_new_offer_title').val()){
		        alert(salesking_display_settings.offer_must_have_title);
		        return;
		    }
		    if (!$('#b2bking_admin_offer_textarea').val()){
		        alert(salesking_display_settings.offer_must_have_product);
		        return;
		    }

		    if (confirm(salesking_display_settings.are_you_sure_save_offer)){
		        var datavar = {
		            action: 'b2bking_save_new_ajax_offer_sk',
		            security: salesking_display_settings.security,
		            uservisibility: $('#b2bking_category_users_textarea').val(),
		            customtext: $('#b2bking_offer_customtext_textarea').val(),
		            offerdetails: $('#b2bking_admin_offer_textarea').val(),
		            userid: $('#b2bking_new_offer_user_id').val(),
		            offertitle: $('#b2bking_new_offer_title').val(),
		            newedit: $('.b2bking_salesking_save_new_offer').val()
		        };

		        // send quote
		        let quote = params.get('quote'); // is the string "Jonathan Smith".
		        if (quote !== null && quote !== ''){
		            datavar.b2bking_quote_response = quote;
		        }

		       //  b2bking_group_visibility_container_content
		        // for each checkbox adde
		        var groupvisibilitytext = '';
		        $('.b2bking_group_visibility_container_content_checkbox_input:checkbox:checked').each(function(){
		            groupvisibilitytext += $(this).attr('name')+',';
		        });

		        datavar.groupvisibility = groupvisibilitytext;

		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		            var offeridd = response;
		            // ask if email the offer
		            if (vall === 'new'){
		                if (confirm(salesking_display_settings.also_email_offer)){
		                        var datavar = {
		                            action: 'b2bking_email_offer_sk',
		                            security: salesking_display_settings.security,
		                            offerid: offeridd,
		                            offerlink: salesking_display_settings.offers_endpoint_link,
		                        };

		                        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		                           alert(salesking_display_settings.email_has_been_sent);
		                           window.location=salesking_display_settings.offers_link;
		                        });
		                } else {
		                    window.location=salesking_display_settings.offers_link;
		                }
		            } else {
		                window.location=salesking_display_settings.offers_link;
		            }
		            
		        });
		    }
		});

		// When click "add item" add new offer item
		$('body').on('click', '.b2bking_offer_add_item_button', addNewOfferItem);

		var offerItemsCounter = 1;
		function addNewOfferItem(){
		    // destroy select2
		    $('.b2bking_offer_product_selector').select2();
		    $('.b2bking_offer_product_selector').select2('destroy');

		    let currentItem = offerItemsCounter;
		    let nextItem = currentItem+1;
		    offerItemsCounter++;
		    $('#b2bking_offer_number_1').clone().attr('id', 'b2bking_offer_number_'+nextItem).insertAfter('#b2bking_offer_number_1');
		    // clear values from clone
		    $('#b2bking_offer_number_'+nextItem+' .b2bking_offer_text_input').val('');
		    $('#b2bking_offer_number_'+nextItem+' .b2bking_offer_product_selector').val('').trigger('change');
		    // remove delete if it exists
		    $('#b2bking_offer_number_'+nextItem+' .b2bking_offer_delete_item_button').remove();
		    
		    $('#b2bking_offer_number_'+nextItem+' .b2bking_item_subtotal').text(salesking_display_settings.currency_symbol+'0');
		    // add delete button to new item
		    $('<button type="button" class="secondary-button button b2bking_offer_delete_item_button btn btn-secondary">'+salesking_display_settings.text_delete+'</button>').insertAfter('#b2bking_offer_number_'+nextItem+' .b2bking_offer_add_item_button');
		    
		    //reinitialize select2
		    $('.b2bking_offer_product_selector').select2();
		}

		// On click "delete"
		$('body').on('click', '.b2bking_offer_delete_item_button', function(){
		    $(this).parent().parent().remove();
		    offerCalculateTotals();
		    offerSetHiddenField();
		});

		// On quantity or price change, calculate totals
		$('body').on('input', '.b2bking_offer_item_quantity, .b2bking_offer_item_name, .b2bking_offer_item_price', function(){
		    offerCalculateTotals();
		    offerSetHiddenField();
		});
		
		function offerCalculateTotals(){
		    let total = 0;
		    // foreach item calculate subtotal
		    $('.b2bking_offer_item_quantity').each(function(){
		        let quantity = $(this).val();
		        let price = $(this).parent().parent().find('.b2bking_offer_item_price').val();
		        if (quantity !== undefined && price !== undefined){
		            // set subtotal
		            total+=price*quantity;
		            $(this).parent().parent().find('.b2bking_item_subtotal').text(salesking_display_settings.currency_symbol+Number((price*quantity).toFixed(4)));
		        }
		    });

		    // finished, add up subtotals to get total
		    $('#b2bking_offer_total_text_number').text(salesking_display_settings.currency_symbol+Number((total).toFixed(4)));
		}

		function offerSetHiddenField(){
		    let field = '';
		    // clear textarea
		    $('#b2bking_admin_offer_textarea').val('');
		    // go through all items and list them IF they have PRICE AND QUANTITY
		    $('.b2bking_offer_item_quantity').each(function(){
		        let quantity = $(this).val();
		        let price = $(this).parent().parent().find('.b2bking_offer_item_price').val();
		        if (quantity !== undefined && price !== undefined && quantity !== null && price !== null && quantity !== '' && price !== ''){
		            // Add it to string
		            let name = $(this).parent().parent().find('.b2bking_offer_item_name').val();
		            if (name === undefined || name === ''){
		                name = '(no title)';
		            }
		            field+= name+';'+quantity+';'+price+'|';
		        }
		    });

		    // at the end, remove last character
		    field = field.substring(0, field.length - 1);
		    $('#b2bking_admin_offer_textarea').val(field);
		}

		function offerRetrieveHiddenField(){
		    // get field;
		    let field = $('#b2bking_admin_offer_textarea').val();
		    let itemsArray = field.split('|');
		    // foreach condition, add condition, add new item
		    itemsArray.forEach(function(item){
		        let itemDetails = item.split(';');
		        if (itemDetails[0] !== undefined && itemDetails[0] !== ''){
		            $('#b2bking_offer_number_'+offerItemsCounter+' .b2bking_offer_item_name').val(itemDetails[0]);
		            $('#b2bking_offer_number_'+offerItemsCounter+' .b2bking_offer_item_quantity').val(itemDetails[1]);
		            $('#b2bking_offer_number_'+offerItemsCounter+' .b2bking_offer_item_price').val(itemDetails[2]);
		            addNewOfferItem();
		        }
		    });
		    // at the end, remove the last Item added
		    if (offerItemsCounter > 1){
		        $('#b2bking_offer_number_'+offerItemsCounter).remove();
		    }

		}
		// OFFERS INTEGRATION END

		if (parseInt(salesking_display_settings.ajax_customers_table) === 0){
			var oTable = $('#salesking_dashboard_customers_table').DataTable({
				"language": {
				    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
				},
				oLanguage: {
	                sSearch: ""
	            },
	            stateSave: true,
	            dom: 'Bfrtip',
	            buttons: {
	                buttons: [
	                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
	                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          } },
	                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
	                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
	                ]
	            }
			});
		} else {
			var oTable = $('#salesking_dashboard_customers_table').DataTable({
				"language": {
				    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
				},
				oLanguage: {
	                sSearch: ""
	            },
	            stateSave: true,
	            dom: 'Bfrtip',
	            buttons: {
	                buttons: [
	                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
	                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          } },
	                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
	                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
	                ]
	            },
       			"processing": true,
       			"serverSide": true,
       			"info": false,
       		    "ajax": {
       		   		"url": salesking_display_settings.ajaxurl,
       		   		"type": "POST",
       		   		"data":{
       		   			action: 'salesking_customers_table_ajax',
       		   			security: salesking_display_settings.security,
       		   		}
       		   	},
       		   	createdRow: function( row, data, dataIndex ) {
   		   	        // Set the data-status attribute, and add a class
   		   	        $( row ).addClass('nk-tb-item');
   		   	        $( row ).find('td').addClass('nk-tb-col');
   		   	        $( row ).find('td:eq(0)').addClass('salesking-column-large');
   		   	        
   		   	    }
			});
		}
	

		$('#salesking_customers_search').keyup(function(){
		      oTable.search($(this).val()).draw() ;
		});

		// Teams table
		var aoTable = $('#salesking_dashboard_teams_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            stateSave: true,
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});

		$('#salesking_teams_search').keyup(function(){
		      aoTable.search($(this).val()).draw() ;
		});


		// Orders datatable
		if (parseInt(salesking_display_settings.ajax_orders_table) === 0){
		    $('#salesking_dashboard_orders_table tfoot tr:eq(0) th').each( function (i) {
		        var title = $(this).text();
		        $(this).html( '<input type="text" class="salesking_search_column" placeholder="'+salesking_display_settings.searchtext+title+'..." />' );
		 
		        $( 'input', this ).on( 'keyup change', function () {
		            if ( abbtable.column(i).search() !== this.value ) {
		                abbtable
		                    .column(i)
		                    .search( this.value )
		                    .draw();
		            }
		        } );
		    } );

			 
			var abbtable = $('#salesking_dashboard_orders_table').DataTable({
				"language": {
				    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
				},
				oLanguage: {
	                sSearch: ""
	            },
	            dom: 'Bfrtip',
	            order: [[ 0, "desc" ]],
	            stateSave: true,
	            buttons: {
	                buttons: [
	                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
	                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          } },
	                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
	                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
	                ]
	            }

			});
		} else {
			var abbtable = $('#salesking_dashboard_orders_table').DataTable({
				"language": {
				    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
				},
				oLanguage: {
	                sSearch: ""
	            },
	            dom: 'Bfrtip',
	            stateSave: true,
	            order: [[ 0, "desc" ]],
	            buttons: {
	                buttons: [
	                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
	                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          } },
	                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
	                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
	                ]
	            },
	            "processing": true,
       			"serverSide": true,
       			"info": false,
       		    "ajax": {
       		   		"url": salesking_display_settings.ajaxurl,
       		   		"type": "POST",
       		   		"data":{
       		   			action: 'salesking_orders_table_ajax',
       		   			security: salesking_display_settings.security,
       		   		}
       		   	},
       		   	createdRow: function( row, data, dataIndex ) {
   		   	        // Set the data-status attribute, and add a class
   		   	        $( row ).addClass('nk-tb-item');
   		   	        $( row ).find('td').addClass('nk-tb-col');
   		   	        $( row ).find('td:eq(0)').addClass('salesking-column-large');
   		   	    }

			});
		}

		$('#salesking_orders_search').keyup(function(){
		      abbtable.search($(this).val()).draw() ;
		});

		$('#salesking_orders_search').trigger('keyup');

		// Earnings datatable
	    $('#salesking_dashboard_earnings_table tfoot tr:eq(0) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" class="salesking_search_column" placeholder="'+salesking_display_settings.searchtext+title+'..." />' );
	 
	        $( 'input', this ).on( 'keyup change', function () {
	            if ( table.column(i).search() !== this.value ) {
	                table
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	        } );
	    } );

		 
		var table = $('#salesking_dashboard_earnings_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            stateSave: true,
            order: [[ 0, "desc" ]],
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          }},
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});


		$('#salesking_earnings_search').keyup(function(){
		      table.search($(this).val()).draw() ;
		});

		// Subagents arnings datatable
	    $('#salesking_dashboard_subagents_earnings_table tfoot tr:eq(0) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" class="salesking_search_column" placeholder="'+salesking_display_settings.searchtext+title+'..." />' );
	 
	        $( 'input', this ).on( 'keyup change', function () {
	            if ( actable.column(i).search() !== this.value ) {
	                actable
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	        } );
	    } );

		 
		var actable = $('#salesking_dashboard_subagents_earnings_table').DataTable({
			"language": {
			    "url": salesking_display_settings.datatables_folder+salesking_display_settings.tables_language_option+'.json'
			},
			oLanguage: {
                sSearch: ""
            },
            dom: 'Bfrtip',
            stateSave: true,
            order: [[ 0, "desc" ]],
            buttons: {
                buttons: [
                    { extend: 'csvHtml5', className: buttonclass, text: '↓ CSV', exportOptions: { columns: ":visible" } },
                    { extend: 'pdfHtml5', className: buttonclass, text: '↓ PDF', exportOptions: { columns: ":visible" }, customize: function(doc) {
			              doc.defaultStyle.font = salesking_display_settings.pdf_download_font;
			          } },
                    { extend: 'print', className: buttonclass, text: salesking_display_settings.print, exportOptions: { columns: ":visible" } },
                    { extend: 'colvis', className: buttonclass, text: salesking_display_settings.edit_columns },
                ]
            }
		});


		$('#salesking_subagents_earnings_search').keyup(function(){
		      actable.search($(this).val()).draw() ;
		});



		// On clicking Save coupon
		$('#salesking_dashboard_save_coupon').on('click', function(e){

			// check that coupon is valid
			if ($('#salesking_coupon_submit_form')[0].checkValidity()){
				// Run ajax request
				var datavar = {
		            action: 'saleskingsavecoupon',
		            security: salesking_display_settings.security,
		            couponcode: $('#salesking_coupon_code_input').val(),
		            expirydate: $('#salesking_expiry_date_input').val(),
		            minspend: $('#salesking_minimum_spend_input').val(),
		            maxspend: $('#salesking_maximum_spend_input').val(),
		            discount: $('#salesking_discount_input').val(),
		            limit: $('#salesking_limit_input').val(),	
		            exclude: $('#salesking_exclude_sales_items').is(":checked"),	
		            allowfree: $('#salesking_allow_free_shipping').is(":checked"),	
		        };

				$.post(salesking_display_settings.ajaxurl, datavar, function(response){
					alert(salesking_display_settings.coupon_created);
					window.location.reload();
				});
			} else {
				$('#salesking_coupon_submit_form')[0].reportValidity();
			}
			
		});


		$('.salesking_delete_coupon').on('click', function(){
			// Run ajax request
			if (confirm(salesking_display_settings.sure_delete_coupon)){
				var datavar = {
		            action: 'saleskingdeletecoupon',
		            security: salesking_display_settings.security,
		            couponpostid: $(this).val(),
		        };
		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	window.location.reload();
		        });
		    }
		});

		$('#salesking_registration_link_button').on('click', function(){
			var copyText = document.getElementById("salesking_registration_link");
			copyText.select();
			copyText.setSelectionRange(0, 99999); /* For mobile devices */

			/* Copy the text inside the text field */
			document.execCommand("copy");
			$('#salesking_registration_link_button').text(salesking_display_settings.copied);
			setTimeout(function(){
				$('#salesking_registration_link_button').text(salesking_display_settings.copy);
			}, 900);
		});

		$('#salesking_shopping_link_button').on('click', function(){
			var copyText = document.getElementById("salesking_shopping_link");
			copyText.select();
			copyText.setSelectionRange(0, 99999); /* For mobile devices */

			/* Copy the text inside the text field */
			document.execCommand("copy");
			$('#salesking_shopping_link_button').text(salesking_display_settings.copied);
			setTimeout(function(){
				$('#salesking_shopping_link_button').text(salesking_display_settings.copy);
			}, 900);
		});


		$('#salesking_generator_link_button').on('click', function(){

			var link = $('#salesking_generator_link').val();
			// add affiliate
			var affiliate = $('#salesking_shopping_link').val();
			affiliate = '?'+affiliate.split('?')[1];
			link = link+affiliate;

			$('#salesking_generator_link').val(link);

			var copyText = document.getElementById("salesking_generator_link");
			copyText.select();
			copyText.setSelectionRange(0, 99999); /* For mobile devices */

			/* Copy the text inside the text field */
			document.execCommand("copy");

			$('#salesking_generator_link_button').text(salesking_display_settings.ready);
			$('#salesking_generator_link_button').prop('disabled', true);
			$('#salesking_generator_link').prop('readonly', true);
			$('.tooltip-inner').text(salesking_display_settings.link_copied);
			setTimeout(function(){
				$('.tooltip-inner').remove();
			}, 600);
		});

		$('#salesking_create_cart_button').on('click', function(){

			var cartname = $('#salesking_create_cart_name').val();

			// Run ajax request
			if (confirm(salesking_display_settings.sure_create_cart)){
				var datavar = {
		            action: 'saleskingcreatecart',
		            security: salesking_display_settings.security,
		            name: cartname,
		        };

		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	window.location.reload();
		        });
		    }
		});

		$('.salesking_copy_cart_link').on('click', function(){

			var text = $(this).val();

			// Create a "hidden" input
			var aux = document.createElement("input");
			aux.setAttribute("value", text);
			document.body.appendChild(aux);
			aux.select();
			document.execCommand("copy");
			document.body.removeChild(aux);

			$(this).text(salesking_display_settings.copied);
			var thisbutton = $(this);
			setTimeout(function(){
				$(thisbutton).text(salesking_display_settings.copy_link);
			}, 1000);

		});

		$('.salesking_delete_cart_link').on('click', function(){
			var cartname = $(this).val();
			// Run ajax request
			if (confirm(salesking_display_settings.sure_delete_cart)){
				var datavar = {
		            action: 'saleskingdeletecart',
		            security: salesking_display_settings.security,
		            name: cartname,
		        };

		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	window.location.reload();
		        });
		    }
		});

		 let isNationalIdValid = false;
    let isPhoneNoValid = false;
    let isPhoneNoUnique = false;

    // تابع اعتبارسنجی کد ملی
    function validateIranianNationalId(nationalId) {
        if (!/^\d{10}$/.test(nationalId)) return false;
        var check = parseInt(nationalId.charAt(9));
        var sum = 0;
        for (var i = 0; i < 9; i++) {
            sum += parseInt(nationalId.charAt(i)) * (10 - i);
        }
        sum = sum % 11;
        return (sum < 2 && check === sum) || (sum >= 2 && check === 11 - sum);
    }

	function National_ID_Location(code) {
    var location = '';
    if (code == "169") location = "استان آذربایجان شرقی - شهر آذر شهر";
    if (code == "170") location = "استان آذربایجان شرقی - شهر اسکو";
    if (code == "149" || code == "150") location = "استان آذربایجان شرقی - شهر اهر";
    if (code == "171") location = "استان آذربایجان شرقی - شهر بستان آباد";
    if (code == "168") location = "استان آذربایجان شرقی - شهر بناب";
    if (code == "136" || code == "137" || code == "138") location = "استان آذربایجان شرقی - شهر تبریز";
    if (code == "545") location = "استان آذربایجان شرقی - شهر ترکمانچای";
    if (code == "505") location = "استان آذربایجان شرقی - شهر جلفا";
    if (code == "636") location = "استان آذربایجان شرقی - شهر چاروایماق";
    if (code == "164" || code == "165") location = "استان آذربایجان شرقی - شهر سراب";
    if (code == "172") location = "استان آذربایجان شرقی - شهر شبستر";
    if (code == "623") location = "استان آذربایجان شرقی - شهر صوفیان";
    if (code == "506") location = "استان آذربایجان شرقی - شهر عجب شیر";
    if (code == "519") location = "استان آذربایجان شرقی - شهر کلیبر";
    if (code == "154" || code == "155") location = "استان آذربایجان شرقی - شهر مراغه";
    if (code == "567") location = "استان آذربایجان شرقی - شهر ورزقان";
    if (code == "173") location = "استان آذربایجان شرقی - شهر هریس";
    if (code == "159" || code == "160") location = "استان آذربایجان شرقی - شهر هشترود";
    if (code == "604") location = "استان آذربایجان شرقی - شهر هوراند";
    if (code == "274" || code == "275") location = "استان آذربایجان غربی - شهر ارومیه";
    if (code == "295") location = "استان آذربایجان غربی - شهر اشنویه";
    if (code == "637") location = "استان آذربایجان غربی - شهر انزل";
    if (code == "292") location = "استان آذربایجان غربی - شهر بوکان";
    if (code == "492") location = "استان آذربایجان غربی - شهر پلدشت";
    if (code == "289") location = "استان آذربایجان غربی - شهر پیرانشهر";
    if (code == "677") location = "استان آذربایجان غربی - شهر  تخت سلیمان";
    if (code == "294") location = "استان آذربایجان غربی - شهر تکاب";
    if (code == "493") location = "استان آذربایجان غربی - شهر چایپاره";
    if (code == "279" || code == "280") location = "استان آذربایجان غربی - شهر خوی";
    if (code == "288") location = "استان آذربایجان غربی - شهر سردشت";
    if (code == "284" || code == "285") location = "استان آذربایجان غربی - شهر سلماس";
    if (code == "638") location = "استان آذربایجان غربی - شهر سیلوانه";
    if (code == "291") location = "استان آذربایجان غربی - شهر سیه چشمه(چالدران)";
    if (code == "640") location = "استان آذربایجان غربی - شهر شوط";
    if (code == "293") location = "استان آذربایجان غربی - شهر  شاهین دژ";
    if (code == "675") location = "استان آذربایجان غربی - شهر کشاورز";
    if (code == "282" || code == "283") location = "استان آذربایجان غربی - شهر ماکو";
    if (code == "286" || code == "287") location = "استان آذربایجان غربی - شهر مهاباد";
    if (code == "296" || code == "297") location = "استان آذربایجان غربی - شهر میاندوآب";
    if (code == "290") location = "استان آذربایجان غربی - شهر نقده";
    if (code == "400" || code == "401") location = "استان همدان - شهر اسدآباد";
    if (code == "404" || code == "405") location = "استان همدان - شهر بهار";
    if (code == "397") location = "استان همدان - شهر تویسرکان";
    if (code == "398" || code == "399") location = "استان همدان - شهر رزن";
    if (code == "647") location = "استان همدان - شهر شراء و پیشخوار";
    if (code == "502") location = "استان همدان - شهر فامنین";
    if (code == "584") location = "استان همدان - شهر قلقل رود";
    if (code == "402" || code == "403") location = "استان همدان - شهر کبودرآهنگ";
    if (code == "392" || code == "393") location = "استان همدان - شهر ملایر";
    if (code == "395" || code == "396") location = "استان همدان - شهر نهاوند";
    if (code == "386" || code == "387") location = "استان همدان - شهر همدان";
    if (code == "503") location = "استان یزد - شهر ابرکوه";
    if (code == "444") location = "استان یزد - شهر اردکان";
    if (code == "551") location = "استان یزد - شهر اشکذر";
    if (code == "447") location = "استان یزد - شهر بافق";
    if (code == "561") location = "استان یزد - شهر بهاباد";
    if (code == "445") location = "استان یزد - شهر تفت";
    if (code == "718") location = "استان یزد - شهر دستگردان";
    if (code == "083") location = "استان یزد - شهر طبس";
    if (code == "446") location = "استان یزد - شهر مهریز";
    if (code == "448") location = "استان یزد - شهر میبد";
    if (code == "552") location = "استان یزد - شهر نیر";
    if (code == "543") location = "استان یزد - شهر هرات و مروست";
    if (code == "442" || code == "443") location = "استان یزد - شهر یزد";
    if (code == "051") location = "استان مرکزی - شهر آشتیان";
    if (code == "052" || code == "053") location = "استان مرکزی - شهر اراک";
    if (code == "058") location = "استان مرکزی - شهر تفرش";
    if (code == "055") location = "استان مرکزی - شهر خمین";
    if (code == "617") location = "استان مرکزی - شهر خنداب";
    if (code == "057") location = "استان مرکزی - شهر دلیجان";
    if (code == "618") location = "استان مرکزی - شهر  زرند مرکزی";
    if (code == "059" || code == "060") location = "استان مرکزی - شهر  ساوه";
    if (code == "061" || code == "062") location = "استان مرکزی - شهر سربند";
    if (code == "544") location = "استان مرکزی - شهر فراهان";
    if (code == "056") location = "استان مرکزی - شهر محلات";
    if (code == "571") location = "استان مرکزی - شهر وفس";
    if (code == "593") location = "استان مرکزی - شهر هندودر";
    if (code == "667") location = "استان هرمزگان - شهر ابوموسی";
    if (code == "348") location = "استان هرمزگان - شهر بستک";
    if (code == "586") location = "استان هرمزگان - شهر بشاگرد";
    if (code == "338" || code == "339") location = "استان هرمزگان - شهر بندرعباس";
    if (code == "343" || code == "344") location = "استان هرمزگان - شهر بندرلنگه";
    if (code == "346") location = "استان هرمزگان - شهر جاسک";
    if (code == "337") location = "استان هرمزگان - شهر  حاجی آباد";
    if (code == "554") location = "استان هرمزگان - شهر خمیر";
    if (code == "469") location = "استان هرمزگان - شهر رودان";
    if (code == "537") location = "استان هرمزگان - شهر فین";
    if (code == "345") location = "استان هرمزگان - شهر قشم";
    if (code == "470") location = "استان هرمزگان - شهر گاوبندی";
    if (code == "341" || code == "342") location = "استان هرمزگان - شهر میناب";
    if (code == "483" || code == "484") location = "استان لرستان - شهر ازنا";
    if (code == "557") location = "استان لرستان - شهر  اشترینان";
    if (code == "418") location = "استان لرستان - شهر الشتر";
    if (code == "416" || code == "417") location = "استان لرستان - شهر الیگودرز";
    if (code == "412" || code == "413") location = "استان لرستان - شهر بروجرد";
    if (code == "592") location = "استان لرستان - شهر پاپی";
    if (code == "612") location = "استان لرستان - شهر چغلوندی";
    if (code == "613") location = "استان لرستان - شهر چگنی";
    if (code == "406" || code == "407") location = "استان لرستان - شهر خرم آباد";
    if (code == "421") location = "استان لرستان - شهر دورود";
    if (code == "598") location = "استان لرستان - شهر  رومشکان";
    if (code == "419") location = "استان لرستان - شهر کوهدشت";
    if (code == "385") location = "استان لرستان - شهر  ملاوی(پلدختر)";
    if (code == "420") location = "استان لرستان - شهر  نورآباد(دلفان)";
    if (code == "528") location = "استان لرستان - شهر ویسیان";
    if (code == "213" || code == "214") location = "استان مازندران - شهر آمل";
    if (code == "205" || code == "206") location = "استان مازندران - شهر بابل";
    if (code == "498") location = "استان مازندران - شهر بابل";
    if (code == "568") location = "استان مازندران - شهر بندپی";
    if (code == "711") location = "استان مازندران - شهر بندپی شرقی";
    if (code == "217" || code == "218") location = "استان مازندران - شهر بهشهر";
    if (code == "221") location = "استان مازندران - شهر تنکابن";
    if (code == "582") location = "استان مازندران - شهر جویبار";
    if (code == "483") location = "استان مازندران - شهر چالوس";
    if (code == "625") location = "استان مازندران - شهر چمستان";
    if (code == "576") location = "استان مازندران - شهر چهاردانگه";
    if (code == "578") location = "استان مازندران - شهر دودانگه";
    if (code == "227") location = "استان مازندران - شهر رامسر";
    if (code == "208" || code == "209") location = "استان مازندران - شهر ساری";
    if (code == "225") location = "استان مازندران - شهر سوادکوه";
    if (code == "577") location = "استان مازندران - شهر شیرگاه";
    if (code == "712") location = "استان مازندران - شهر  عباس آباد";
    if (code == "215" || code == "216") location = "استان مازندران - شهر قائمشهر";
    if (code == "626") location = "استان مازندران - شهر کجور";
    if (code == "627") location = "استان مازندران - شهر کلاردشت";
    if (code == "579") location = "استان مازندران - شهر گلوگاه";
    if (code == "713") location = "استان مازندران - شهر میاندورود";
    if (code == "499") location = "استان مازندران - شهر نکاء";
    if (code == "222") location = "استان مازندران - شهر نور";
    if (code == "219" || code == "220") location = "استان مازندران - شهر نوشهر";
    if (code == "500" || code == "501") location = "استان مازندران - شهر  هراز و محمودآباد";
    if (code == "623") location = "استان گلستان - شهر آزادشهر";
    if (code == "497") location = "استان گلستان - شهر  آق قلا";
    if (code == "223") location = "استان گلستان - شهر بندرترکمن";
    if (code == "689") location = "استان گلستان - شهر بندرگز";
    if (code == "487") location = "استان گلستان - شهر رامیان";
    if (code == "226") location = "استان گلستان - شهر  علی آباد";
    if (code == "224") location = "استان گلستان - شهر کردکوی";
    if (code == "386") location = "استان گلستان - شهر کلاله";
    if (code == "211" || code == "212") location = "استان گلستان - شهر گرگان";
    if (code == "628") location = "استان گلستان - شهر گمیشان";
    if (code == "202" || code == "203") location = "استان گلستان - شهر  گنبد کاووس";
    if (code == "531") location = "استان گلستان - شهر  مراوه تپه";
    if (code == "288") location = "استان گلستان - شهر مینودشت";
    if (code == "261") location = "استان گیلان - شهر آستارا";
    if (code == "273") location = "استان گیلان - شهر آستانه";
    if (code == "630") location = "استان گیلان - شهر املش";
    if (code == "264") location = "استان گیلان - شهر  بندرانزلی";
    if (code == "518") location = "استان گیلان - شهر خمام";
    if (code == "631") location = "استان گیلان - شهر  رحیم آباد";
    if (code == "258" || code == "259") location = "استان گیلان - شهر رشت";
    if (code == "570") location = "استان گیلان - شهر رضوانشهر";
    if (code == "265") location = "استان گیلان - شهر رودبار";
    if (code == "268" || code == "269") location = "استان گیلان - شهر رودسر";
    if (code == "653") location = "استان گیلان - شهر سنگر";
    if (code == "517") location = "استان گیلان - شهر سیاهکل";
    if (code == "569") location = "استان گیلان - شهر شفت";
    if (code == "267") location = "استان گیلان - شهر  صومعه سرا";
    if (code == "262" || code == "263") location = "استان گیلان - شهر طالش";
    if (code == "593") location = "استان گیلان - شهر عمارلو";
    if (code == "266") location = "استان گیلان - شهر فومن";
    if (code == "693") location = "استان گیلان - شهر  کوچصفهان";
    if (code == "271" || code == "272") location = "استان گیلان - شهر لاهیجان";
    if (code == "694") location = "استان گیلان - شهر  لشت نشاء";
    if (code == "270") location = "استان گیلان - شهر لنگرود";
    if (code == "516") location = "استان گیلان - شهر  ماسال و شاندرمن";
    if (code == "333" || code == "334") location = "استان کرمانشاه - شهر اسلام آباد";
    if (code == "691") location = "استان کرمانشاه - شهر باینگان";
    if (code == "322" || code == "323") location = "استان کرمانشاه - شهر پاوه";
    if (code == "595") location = "استان کرمانشاه - شهر ثلاث باباجانی";
    if (code == "395") location = "استان کرمانشاه - شهر جوانرود";
    if (code == "641") location = "استان کرمانشاه - شهر حمیل";
    if (code == "596") location = "استان کرمانشاه - شهر روانسر";
    if (code == "336") location = "استان کرمانشاه - شهر سرپل ذهاب";
    if (code == "335") location = "استان کرمانشاه - شهر سنقر";
    if (code == "496") location = "استان کرمانشاه - شهر صحنه";
    if (code == "337") location = "استان کرمانشاه - شهر قصرشیرین";
    if (code == "324" || code == "325") location = "استان کرمانشاه - شهر کرمانشاه";
    if (code == "394") location = "استان کرمانشاه - شهر کرند";
    if (code == "330") location = "استان کرمانشاه - شهر کنگاور";
    if (code == "332") location = "استان کرمانشاه - شهر گیلانغرب";
    if (code == "331") location = "استان کرمانشاه - شهر هرسین";
    if (code == "687") location = "استان کهکیلویه و بویراحمد - شهر باشت";
    if (code == "422" || code == "423") location = "استان کهکیلویه و بویراحمد - شهر  بویراحمد(یاسوج)";
    if (code == "599") location = "استان کهکیلویه و بویراحمد - شهر بهمنی";
    if (code == "600") location = "استان کهکیلویه و بویراحمد - شهر چاروسا";
    if (code == "688") location = "استان کهکیلویه و بویراحمد - شهر دروهان";
    if (code == "424" || code == "425") location = "استان کهکیلویه و بویراحمد - شهر  کهکیلویه(دهدشت)";
    if (code == "426") location = "استان کهکیلویه و بویراحمد - شهر  گچساران(دوگنبدان)";
    if (code == "550") location = "استان کهکیلویه و بویراحمد - شهر لنده";
    if (code == "697") location = "استان کهکیلویه و بویراحمد - شهر  مارگون";
    if (code == "384") location = "استان کردستان - شهر بانه";
    if (code == "377" || code == "378") location = "استان کردستان - شهر بیجار";
    if (code == "558") location = "استان کردستان - شهر دهگلان";
    if (code == "385") location = "استان کردستان - شهر دیواندره";
    if (code == "646") location = "استان کردستان - شهر سروآباد";
    if (code == "375" || code == "376") location = "استان کردستان - شهر سقز";
    if (code == "372" || code == "373") location = "استان کردستان - شهر سنندج";
    if (code == "379" || code == "380") location = "استان کردستان - شهر قروه";
    if (code == "383") location = "استان کردستان - شهر کامیاران";
    if (code == "674") location = "استان کردستان - شهر کرانی";
    if (code == "381" || code == "382") location = "استان کردستان - شهر مریوان";
    if (code == "676") location = "استان کردستان - شهر نمشیر";
    if (code == "722") location = "استان کرمان - شهر ارزونیه";
    if (code == "542") location = "استان کرمان - شهر انار";
    if (code == "312" || code == "313") location = "استان کرمان - شهر بافت";
    if (code == "317") location = "استان کرمان - شهر بردسیر";
    if (code == "310" || code == "311") location = "استان کرمان - شهر بم";
    if (code == "302" || code == "303") location = "استان کرمان - شهر جیرفت";
    if (code == "583") location = "استان کرمان - شهر رابر";
    if (code == "321") location = "استان کرمان - شهر راور";
    if (code == "382") location = "استان کرمان - شهر راین";
    if (code == "304" || code == "305") location = "استان کرمان - شهر رفسنجان";
    if (code == "536") location = "استان کرمان - شهر  رودبار کهنوج";
    if (code == "605") location = "استان کرمان - شهر ریگان";
    if (code == "308" || code == "309") location = "استان کرمان - شهر زرند";
    if (code == "306" || code == "307") location = "استان کرمان - شهر سیرجان";
    if (code == "319") location = "استان کرمان - شهر شهداد";
    if (code == "313" || code == "314") location = "استان کرمان - شهر شهربابک";
    if (code == "606") location = "استان کرمان - شهر عنبرآباد";
    if (code == "320") location = "استان کرمان - شهر فهرج";
    if (code == "698") location = "استان کرمان - شهر قلعه گنج";
    if (code == "298" || code == "299") location = "استان کرمان - شهر کرمان";
    if (code == "535") location = "استان کرمان - شهر کوهبنان";
    if (code == "315" || code == "316") location = "استان کرمان - شهر کهنوج";
    if (code == "318") location = "استان کرمان - شهر گلباف";
    if (code == "607") location = "استان کرمان - شهر ماهان";
    if (code == "608") location = "استان کرمان - شهر منوجان";
    if (code == "508") location = "استان قزوین - شهر آبیک";
    if (code == "538") location = "استان قزوین - شهر آوج";
    if (code == "728") location = "استان قزوین - شهر البرز";
    if (code == "509") location = "استان قزوین - شهر بوئین زهرا";
    if (code == "438" || code == "439") location = "استان قزوین - شهر تاکستان";
    if (code == "580") location = "استان قزوین - شهر رودبار الموت";
    if (code == "590") location = "استان قزوین - شهر رودبار شهرستان";
    if (code == "559") location = "استان قزوین - شهر ضیاءآباد";
    if (code == "588") location = "استان قزوین - شهر طارم سفلی";
    if (code == "431" || code == "432") location = "استان قزوین - شهر قزوین";
    if (code == "037" || code == "038") location = "استان قم - شهر قم";
    if (code == "702") location = "استان قم - شهر کهک";
    if (code == "240" || code == "241") location = "استان فارس - شهر آباده";
    if (code == "670") location = "استان فارس - شهر  آباده طشک";
    if (code == "648") location = "استان فارس - شهر  ارسنجان";
    if (code == "252") location = "استان فارس - شهر استهبان";
    if (code == "678") location = "استان فارس - شهر  اشکنان";
    if (code == "253") location = "استان فارس - شهر اقلید";
    if (code == "649") location = "استان فارس - شهر اوز";
    if (code == "513") location = "استان فارس - شهر بوانات";
    if (code == "546") location = "استان فارس - شهر بیضا";
    if (code == "671") location = "استان فارس - شهر جویم";
    if (code == "246" || code == "247") location = "استان فارس - شهر جهرم";
    if (code == "654") location = "استان فارس - شهر  حاجی آباد(زرین دشت)";
    if (code == "548") location = "استان فارس - شهر خرامه";
    if (code == "547") location = "استان فارس - شهر  خشت و کمارج";
    if (code == "655") location = "استان فارس - شهر خفر";
    if (code == "248" || code == "249") location = "استان فارس - شهر داراب";
    if (code == "253") location = "استان فارس - شهر سپیدان";
    if (code == "514") location = "استان فارس - شهر سروستان";
    if (code == "665") location = "استان فارس - شهر  سعادت آباد";
    if (code == "673") location = "استان فارس - شهر شیبکوه";
    if (code == "228" || code == "229" || code == "230") location = "استان فارس - شهر شیراز";
    if (code == "679") location = "استان فارس - شهر فراشبند";
    if (code == "256" || code == "257") location = "استان فارس - شهر فسا";
    if (code == "244" || code == "245") location = "استان فارس - شهر  فیروزآباد";
    if (code == "681") location = "استان فارس - شهر  قنقری(خرم بید)";
    if (code == "723") location = "استان فارس - شهر قیروکارزین";
    if (code == "236" || code == "237") location = "استان فارس - شهر کازرون";
    if (code == "683") location = "استان فارس - شهر کوار";
    if (code == "656") location = "استان فارس - شهر کراش";
    if (code == "250" || code == "251") location = "استان فارس - شهر لارستان";
    if (code == "515") location = "استان فارس - شهر لامرد";
    if (code == "242" || code == "243") location = "استان فارس - شهر مرودشت";
    if (code == "238" || code == "239") location = "استان فارس - شهر ممسنی";
    if (code == "657") location = "استان فارس - شهر مهر";
    if (code == "255") location = "استان فارس - شهر نی ریز";
    if (code == "684") location = "استان سمنان - شهر ایوانکی";
    if (code == "700") location = "استان سمنان - شهر بسطام";
    if (code == "642") location = "استان سمنان - شهر بیارجمند";
    if (code == "457") location = "استان سمنان - شهر  دامغان";
    if (code == "456") location = "استان سمنان - شهر سمنان";
    if (code == "458" || code == "459") location = "استان سمنان - شهر شاهرود";
    if (code == "460") location = "استان سمنان - شهر گرمسار";
    if (code == "530") location = "استان سمنان - شهر مهدیشهر";
    if (code == "520") location = "استان سمنان - شهر میامی";
    if (code == "358" || code == "359") location = "استان  سیستان و بلوچستان - شهر ایرانشهر";
    if (code == "682") location = "استان  سیستان و بلوچستان - شهر بزمان";
    if (code == "703") location = "استان  سیستان و بلوچستان - شهر بمپور";
    if (code == "364" || code == "365") location = "استان  سیستان و بلوچستان - شهر چابهار";
    if (code == "371") location = "استان  سیستان و بلوچستان - شهر خاش";
    if (code == "701") location = "استان  سیستان و بلوچستان - شهر دشتیاری";
    if (code == "720") location = "استان  سیستان و بلوچستان - شهر راسک";
    if (code == "366" || code == "367") location = "استان  سیستان و بلوچستان - شهر زابل";
    if (code == "704") location = "استان  سیستان و بلوچستان - شهر زابلی";
    if (code == "361" || code == "362") location = "استان  سیستان و بلوچستان - شهر زاهدان";
    if (code == "369" || code == "370") location = "استان  سیستان و بلوچستان - شهر سراوان";
    if (code == "635") location = "استان  سیستان و بلوچستان - شهر سرباز";
    if (code == "668") location = "استان  سیستان و بلوچستان - شهر  سیب و سوران";
    if (code == "533") location = "استان  سیستان و بلوچستان - شهر  شهرکی و ناروئی(زهک)";
    if (code == "705") location = "استان  سیستان و بلوچستان - شهر  شیب آب";
    if (code == "699") location = "استان  سیستان و بلوچستان - شهر فنوج";
    if (code == "669") location = "استان  سیستان و بلوچستان - شهر قصرقند";
    if (code == "725") location = "استان  سیستان و بلوچستان - شهر کنارک";
    if (code == "597") location = "استان  سیستان و بلوچستان - شهر  لاشار(اسپکه)";
    if (code == "611") location = "استان  سیستان و بلوچستان - شهر میرجاوه";
    if (code == "525") location = "استان  سیستان و بلوچستان - شهر نیک شهر";
    if (code == "181") location = "استان خوزستان - شهر آبادان";
    if (code == "527") location = "استان خوزستان - شهر آغاجاری";
    if (code == "585") location = "استان خوزستان - شهر اروندکنار";
    if (code == "685") location = "استان خوزستان - شهر امیدیه";
    if (code == "663") location = "استان خوزستان - شهر اندیکا";
    if (code == "192" || code == "193") location = "استان خوزستان - شهر اندیمشک";
    if (code == "174" || code == "175") location = "استان خوزستان - شهر اهواز";
    if (code == "183" || code == "184") location = "استان خوزستان - شهر ایذه";
    if (code == "481") location = "استان خوزستان - شهر  باغ ملک";
    if (code == "706") location = "استان خوزستان - شهر  بندر امام خمینی";
    if (code == "194" || code == "195") location = "استان خوزستان - شهر بندرماهشهر";
    if (code == "185" || code == "186") location = "استان خوزستان - شهر بهبهان";
    if (code == "182") location = "استان خوزستان - شهر خرمشهر";
    if (code == "199" || code == "200") location = "استان خوزستان - شهر دزفول";
    if (code == "198") location = "استان خوزستان - شهر  دشت آزادگان";
    if (code == "662") location = "استان خوزستان - شهر  رامشیر";
    if (code == "190" || code == "191") location = "استان خوزستان - شهر رامهرمز";
    if (code == "692") location = "استان خوزستان - شهر سردشت";
    if (code == "189") location = "استان خوزستان - شهر شادگان";
    if (code == "707") location = "استان خوزستان - شهر شاوور";
    if (code == "526") location = "استان خوزستان - شهر شوش";
    if (code == "187" || code == "188") location = "استان خوزستان - شهر شوشتر";
    if (code == "729") location = "استان خوزستان - شهر گتوند";
    if (code == "730") location = "استان خوزستان - شهر لالی";
    if (code == "196" || code == "197") location = "استان خوزستان - شهر مسجدسلیمان";
    if (code == "661") location = "استان خوزستان - شهر هندیجان";
    if (code == "680") location = "استان خوزستان - شهر هویزه";
    if (code == "643") location = "استان خراسان رضوی - شهر  احمدآباد";
    if (code == "562") location = "استان خراسان رضوی - شهر بجستان";
    if (code == "572") location = "استان خراسان رضوی - شهر بردسکن";
    if (code == "074") location = "استان خراسان رضوی - شهر تایباد";
    if (code == "644") location = "استان خراسان رضوی - شهر  تخت جلگه";
    if (code == "072" || code == "073") location = "استان خراسان رضوی - شهر تربت جام";
    if (code == "069" || code == "070") location = "استان خراسان رضوی - شهر تربت حیدریه";
    if (code == "521") location = "استان خراسان رضوی - شهر جغتای";
    if (code == "573") location = "استان خراسان رضوی - شهر جوین";
    if (code == "522") location = "استان خراسان رضوی - شهر چناران";
    if (code == "724") location = "استان خراسان رضوی - شهر  خلیل آباد";
    if (code == "076") location = "استان خراسان رضوی - شهر خواف";
    if (code == "077") location = "استان خراسان رضوی - شهر درگز";
    if (code == "650") location = "استان خراسان رضوی - شهر رشتخوار";
    if (code == "574") location = "استان خراسان رضوی - شهر زبرخان";
    if (code == "078" || code == "079") location = "استان خراسان رضوی - شهر سبزوار";
    if (code == "081") location = "استان خراسان رضوی - شهر سرخس";
    if (code == "084") location = "استان خراسان رضوی - شهر فریمان";
    if (code == "651") location = "استان خراسان رضوی - شهر  فیض آباد";
    if (code == "086" || code == "087") location = "استان خراسان رضوی - شهر قوچان";
    if (code == "089" || code == "090") location = "استان خراسان رضوی - شهر کاشمر";
    if (code == "553") location = "استان خراسان رضوی - شهر کلات";
    if (code == "091") location = "استان خراسان رضوی - شهر گناباد";
    if (code == "092" || code == "093" || code == "094") location = "استان خراسان رضوی - شهر مشهد";
    if (code == "097") location = "استان خراسان رضوی - شهر  مشهد منطقه2";
    if (code == "098") location = "استان خراسان رضوی - شهر  مشهد منطقه3";
    if (code == "096") location = "استان خراسان رضوی - شهر  مشهد منطقه1";
    if (code == "105" || code == "106") location = "استان خراسان رضوی - شهر نیشابور";
    if (code == "063") location = "استان خراسان شمالی - شهر اسفراین";
    if (code == "067" || code == "068") location = "استان خراسان شمالی - شهر  بجنورد";
    if (code == "075") location = "استان خراسان شمالی - شهر جاجرم";
    if (code == "591") location = "استان خراسان شمالی - شهر رازوجرکلان";
    if (code == "082") location = "استان خراسان شمالی - شهر شیروان";
    if (code == "635") location = "استان خراسان شمالی - شهر فاروج";
    if (code == "524") location = "استان خراسان شمالی - شهر مانه و سملقان";
    if (code == "468") location = "استان چهارمحال و بختیاری - شهر اردل";
    if (code == "465") location = "استان چهارمحال و بختیاری - شهر بروجن";
    if (code == "461" || code == "462") location = "استان چهارمحال و بختیاری - شهر شهرکرد";
    if (code == "467") location = "استان چهارمحال و بختیاری - شهر فارسان";
    if (code == "555") location = "استان چهارمحال و بختیاری - شهر کوهرنگ";
    if (code == "633") location = "استان چهارمحال و بختیاری - شهر کیار";
    if (code == "629") location = "استان چهارمحال و بختیاری - شهر گندمان";
    if (code == "466") location = "استان چهارمحال و بختیاری - شهر لردگان";
    if (code == "696") location = "استان چهارمحال و بختیاری - شهر میانکوه";
    if (code == "721") location = "استان خراسان جنوبی - شهر  بشرویه";
    if (code == "064" || code == "065") location = "استان خراسان جنوبی - شهر بیرجند";
    if (code == "523") location = "استان خراسان جنوبی - شهر درمیان";
    if (code == "652") location = "استان خراسان جنوبی - شهر زیرکوه";
    if (code == "719") location = "استان خراسان جنوبی - شهر سرایان";
    if (code == "716") location = "استان خراسان جنوبی - شهر سربیشه";
    if (code == "085") location = "استان خراسان جنوبی - شهر فردوس";
    if (code == "088") location = "استان خراسان جنوبی - شهر قائنات";
    if (code == "563") location = "استان خراسان جنوبی - شهر نهبندان";
    if (code == "529") location = "استان بوشهر - شهر بندر دیلم";
    if (code == "353") location = "استان بوشهر - شهر بندر گناوه";
    if (code == "349" || code == "350") location = "استان بوشهر - شهر بوشهر";
    if (code == "355") location = "استان بوشهر - شهر تنگستان";
    if (code == "609") location = "استان بوشهر - شهر جم";
    if (code == "351" || code == "352") location = "استان بوشهر - شهر  دشتستان";
    if (code == "354") location = "استان بوشهر - شهر دشتی";
    if (code == "732") location = "استان بوشهر - شهر دلوار";
    if (code == "357") location = "استان بوشهر - شهر دیر";
    if (code == "532") location = "استان بوشهر - شهر  سعد آباد";
    if (code == "610") location = "استان بوشهر - شهر شبانکاره";
    if (code == "356") location = "استان بوشهر - شهر کنگان";
    if (code == "556") location = "استان تهران - شهر اسلامشهر";
    if (code == "658") location = "استان تهران - شهر پاکدشت";
    if (code == "001" || code == "002" || code == "003" || code == "004" || code == "005" || code == "006" || code == "007" || code == "008") location = "استان تهران - شهر تهران مرکزی";
    if (code == "011") location = "استان تهران - شهر تهران جنوب";
    if (code == "020") location = "استان تهران - شهر تهران شرق";
    if (code == "025") location = "استان تهران - شهر تهرانشمال";
    if (code == "015") location = "استان تهران - شهر تهران غرب";
    if (code == "043") location = "استان تهران - شهر دماوند";
    if (code == "666") location = "استان تهران - شهر رباط کریم";
    if (code == "489") location = "استان تهران - شهر ساوجبلاغ";
    if (code == "044" || code == "045") location = "استان تهران - شهر شمیران";
    if (code == "048" || code == "049") location = "استان تهران - شهر شهرری";
    if (code == "490" || code == "491") location = "استان تهران - شهر  شهریار";
    if (code == "695") location = "استان تهران - شهر طالقان";
    if (code == "659") location = "استان تهران - شهر فیروزکوه";
    if (code == "031" || code == "032") location = "استان تهران - شهر کرج";
    if (code == "664") location = "استان تهران - شهر کهریزک";
    if (code == "717") location = "استان تهران - شهر نظرآباد";
    if (code == "041" || code == "042") location = "استان تهران - شهر ورامین";
    if (code == "471" || code == "472") location = " امور خارجه -  امور خارجه";
    if (code == "454") location = "استان ایلام - شهر آبدانان";
    if (code == "581") location = "استان ایلام - شهر  ارکوازی(ملکشاهی)";
    if (code == "449" || code == "450") location = "استان ایلام - شهر ایلام";
    if (code == "616") location = "استان ایلام - شهر ایوان";
    if (code == "534") location = "استان ایلام - شهر بدره";
    if (code == "455") location = "استان ایلام - شهر  دره شهر";
    if (code == "451") location = "استان ایلام - شهر دهلران";
    if (code == "726") location = "استان ایلام - شهر زرین آباد";
    if (code == "634") location = "استان ایلام - شهر شیروان لومار";
    if (code == "453") location = "استان ایلام - شهر شیروان و چرداول";
    if (code == "727") location = "استان ایلام - شهر موسیان";
    if (code == "452") location = "استان ایلام - شهر مهران";
    if (code == "145" || code == "146") location = "استان اردبیل - شهر اردبیل";
    if (code == "731") location = "استان اردبیل - شهر ارشق";
    if (code == "690") location = "استان اردبیل - شهر انگوت";
    if (code == "601") location = "استان اردبیل - شهر بیله سوار";
    if (code == "504") location = "استان اردبیل - شهر پارس آباد";
    if (code == "163") location = "استان اردبیل - شهر خلخال";
    if (code == "714") location = "استان اردبیل - شهر خورش رستم";
    if (code == "715") location = "استان اردبیل - شهر سرعین";
    if (code == "566") location = "استان اردبیل - شهر  سنجبد(کوثر)";
    if (code == "166" || code == "167") location = "استان اردبیل - شهر مشکین شهر";
    if (code == "161" || code == "162") location = "استان اردبیل - شهر مغان";
    if (code == "686") location = "استان اردبیل - شهر نمین";
    if (code == "603") location = "استان اردبیل - شهر نیر";
    if (code == "619") location = "استان اصفهان - شهر  آران و بیدگل";
    if (code == "118") location = "استان اصفهان - شهر اردستان";
    if (code == "127" || code == "128" || code == "129") location = "استان اصفهان - شهر اصفهان";
    if (code == "620") location = "استان اصفهان - شهر باغ بهادران";
    if (code == "621") location = "استان اصفهان - شهر بوئین و میاندشت";
    if (code == "549") location = "استان اصفهان - شهر تیران و کرون";
    if (code == "564") location = "استان اصفهان - شهر جرقویه";
    if (code == "575") location = "استان اصفهان - شهر چادگان";
    if (code == "113" || code == "114") location = "استان اصفهان - شهر  خمینی شهر";
    if (code == "122") location = "استان اصفهان - شهر خوانسار";
    if (code == "540") location = "استان اصفهان - شهر خور و بیابانک";
    if (code == "660") location = "استان اصفهان - شهر دولت آباد";
    if (code == "120") location = "استان اصفهان - شهر سمیرم";
    if (code == "512") location = "استان اصفهان - شهر سمیرم سفلی (دهاقان)";
    if (code == "510" || code == "511") location = "استان اصفهان - شهر شاهین شهر";
    if (code == "119") location = "استان اصفهان - شهر شهرضا";
    if (code == "115") location = "استان اصفهان - شهر فریدن";
    if (code == "112") location = "استان اصفهان - شهر فریدونشهر";
    if (code == "110" || code == "111") location = "استان اصفهان - شهر فلاورجان";
    if (code == "125" || code == "126") location = "استان اصفهان - شهر کاشان";
    if (code == "565") location = "استان اصفهان - شهر  کوهپایه";
    if (code == "121") location = "استان اصفهان - شهر گلپایگان";
    if (code == "116" || code == "117") location = "استان اصفهان - شهر  لنجان(زرینشهر)";
    if (code == "541") location = "استان اصفهان - شهر مبارکه";
    if (code == "622") location = "استان اصفهان - شهر میمه";
    if (code == "124") location = "استان اصفهان - شهر نائین";
    if (code == "108" || code == "109") location = "استان اصفهان - شهر  نجف آباد";
    if (code == "123") location = "استان اصفهان - شهر نطنز";
    if (code == "427" || code == "428") location = "استان زنجان - شهر زنجان";
    if (code == "507") location = "استان آذربایجان شرقی - شهر ملکان";
    if (code == "158") location = "استان آذربایجان شرقی - شهر مرند";
    if (code == "152" || code == "153") location = "استان آذربایجان شرقی - شهر میانه";
    if (code == "615") location = "استان قزوین - شهر ابهر و خرمدره";
    return location;
}

    // تابع شناسایی شهر از کد ملی
    function getCityFromNationalId(nationalId) {
        var cityCode = nationalId.substring(0, 3);
       
        return 	 National_ID_Location(cityCode) || 'نامشخص';
    }

    // اعتبارسنجی بلادرنگ کد ملی
    $('#national-id').on('input', function() {
        var nationalId = $(this).val();
        if (nationalId.length === 10 && validateIranianNationalId(nationalId)) {
            isNationalIdValid = true;
            $('#national-id-feedback').text('کد ملی معتبر است. شهر: ' + getCityFromNationalId(nationalId)).removeClass('text-danger').addClass('text-success');
        } else {
            isNationalIdValid = false;
            $('#national-id-feedback').text('کد ملی اشتباه است. لطفا دقت کنید 10 رقم بوده و صحیح باشد').removeClass('text-success').addClass('text-danger');
        }
        updateButtonState();
    });

    // اعتبارسنجی بلادرنگ شماره موبایل و بررسی تکراری نبودن
    $('#phone-no').on('input', function() {
        var phoneNo = $(this).val();
        if (/^9[0-9]{9}$/.test(phoneNo)) {
            isPhoneNoValid = true;
            $('#phone-no-feedback').text('در حال بررسی شماره همراه ...').removeClass('text-success text-danger');
            
            // بررسی تکراری نبودن شماره موبایل
            $.post(salesking_display_settings.ajaxurl, {
                action: 'salesking_check_phone_unique',
                security: salesking_display_settings.security,
                phoneno: phoneNo
            }, function(response) {
                if (response.data === 'unique') {
                    isPhoneNoUnique = true;
                    $('#phone-no-feedback').text('شماره همراه معتبر و مورد قبول است').removeClass('text-danger').addClass('text-success');
                } else {
                    isPhoneNoUnique = false;
                    $('#phone-no-feedback').text('این شماره موبایل قبلا بعوان مشتری ثبت شده است').removeClass('text-success').addClass('text-danger');
                }
                updateButtonState();
            });
        } else {
            isPhoneNoValid = false;
            isPhoneNoUnique = false;
            $('#phone-no-feedback').text('شماره همراه صحیح نیست').removeClass('text-success').addClass('text-danger');
            updateButtonState();
        }
    });

    // به‌روزرسانی وضعیت دکمه افزودن
    function updateButtonState() {
        if (isNationalIdValid && isPhoneNoValid && isPhoneNoUnique && $('#first-name').val() && $('#last-name').val()) {
            $('#salesking_add_customer').prop('disabled', false);
        } else {
            $('#salesking_add_customer').prop('disabled', true);
        }
    }

    // بررسی تغییر در فیلدهای نام و نام خانوادگی برای به‌روزرسانی دکمه
    $('#first-name, #last-name').on('input', updateButtonState);

    // افزودن مشتری
    $('#salesking_add_customer').on('click', function() {
        if ($('#salesking_add_customer_form')[0].checkValidity() && isNationalIdValid && isPhoneNoValid && isPhoneNoUnique) {
            if (confirm(salesking_display_settings.sure_add_customer)) {
                var datavar = {
                    action: 'saleskingaddcustomer',
                    security: salesking_display_settings.security,
                    firstname: $('#first-name').val(),
                    lastname: $('#last-name').val(),
                    nationalid: $('#national-id').val(),
                    phoneno: $('#phone-no').val(),
                    username: $('#phone-no').val(), // شماره موبایل به عنوان نام کاربری
                    emailaddress: $('#email-address').val(),
                    password: $('#national-id').val(), // کد ملی به عنوان پسورد
                };

                $.post(salesking_display_settings.ajaxurl, datavar, function(response) {
					console.log(response);
                    if (!response.success) {
                        alert(salesking_display_settings.customer_created_error + ' ' + response);
                        console.log(response);
                    } else {
                        alert('مشتری با موفقیت اضافه شد');
                        window.location.reload();
                    }
                });
            }
        } else {
            $('#salesking_add_customer_form')[0].reportValidity();
        }
    });

		


	
		// add subagent
		$('#salesking_add_subagent').on('click', function(){	

			if ($('#salesking_add_subagent_form')[0].checkValidity()){

				if (confirm(salesking_display_settings.sure_add_subagent)){
					var datavar = {
			            action: 'saleskingaddsubagent',
			            security: salesking_display_settings.security,
			            firstname: $('#first-name').val(),
			            lastname: $('#last-name').val(),
			            phoneno: $('#phone-no').val(),
			            username: $('#username').val(),
			            emailaddress: $('#email-address').val(),
			            password: $('#password').val(),

			        };

			        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
			        	if (response.startsWith('error')){
			        		alert(salesking_display_settings.subagent_created_error+' '+response);
			        		console.log(response);
			        	} else {
			        		alert(salesking_display_settings.subagent_created);
			        		window.location.reload();
			        	}
			        	
			        });
			    }
			} else {
				$('#salesking_add_subagent_form')[0].reportValidity();
			}

		});

		// when clicking shop as customer
                function saleskingShowLoader(loaderId, message){
                        var loader = $('#'+loaderId);
                        if (!loader.length){
                                $('body').append('<div id="'+loaderId+'" class="salesking_loader"><div class="salesking_loader_backdrop"></div><div class="salesking_loader_box"><div class="salesking_loader_spinner"></div><div class="salesking_loader_text"></div></div></div>');
                                loader = $('#'+loaderId);
                        }

                        loader.find('.salesking_loader_text').text(message);
                        loader.addClass('is-visible');
                }

                $('body').on('click', '.salesking_shop_as_customer', function(){
                        var customerid = $(this).val();
                        var datavar = {
                    action: 'saleskingshopascustomer',
                    security: salesking_display_settings.security,
                    customer: customerid,
                };

                saleskingShowLoader('salesking_customer_switch_loader', 'در حال آماده سازی پروفایل مشتری، لطفا منتظر بمانید');

                $.post(salesking_display_settings.ajaxurl, datavar, function(response){
                        window.location = salesking_display_settings.shopurl;
                });
                });

		// when clicking EDIT shop as customer
                $('body').on('click', '.salesking_shop_as_customer_edit', function(){
                        var customerid = $(this).val();
                        var datavar = {
                    action: 'saleskingshopascustomer',
                    security: salesking_display_settings.security,
                    customer: customerid,
                };

                saleskingShowLoader('salesking_customer_switch_loader', 'در حال آماده سازی پروفایل مشتری، لطفا منتظر بمانید');

                $.post(salesking_display_settings.ajaxurl, datavar, function(response){
                        window.location = salesking_display_settings.accounturl;
                });
                });

                $('#salesking_return_agent').on('click', function(){
                        var agentid = $(this).val();
                        var agentregistered = $('#salesking_return_agent_registered').val();

                        saleskingShowLoader('salesking_agent_switch_loader', 'در حال انتقال به پنل نمایندگی');

                        var datavar = {
                    action: 'saleskingswitchtoagent',
                    security: salesking_display_settings.security,
                    agent: agentid,
	            agentdate: agentregistered,
	        };

	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	window.location = salesking_display_settings.customersurl;
	        });
		});

		/* Payouts */
		showhidepaymentmethods();

		$('input[type=radio][name="saleskingpayoutMethod"]').change(function() {
			showhidepaymentmethods();
		});

		function showhidepaymentmethods(){
			// first hide all methods

			$('.salesking_paypal_info, .salesking_bank_info, .salesking_custom_info').css('display', 'none');
			// Show which payment method the user chose
			let selectedValue = $('input[type=radio][name="saleskingpayoutMethod"]:checked').val();
			if (selectedValue === "paypal") {
				// show paypal
				$('.salesking_paypal_info').css('display', 'block');
			} else if (selectedValue === "bank"){
				$('.salesking_bank_info').css('display', 'block');
			} else if (selectedValue === "custom"){
				$('.salesking_custom_info').css('display', 'block');
			}
		}

		// save payout info
		$('#salesking_save_payout').on('click', function(){	
			if (confirm(salesking_display_settings.sure_save_info)){
				var datavar = {
		            action: 'saleskingsaveinfo',
		            security: salesking_display_settings.security,
		            chosenmethod: $('input[type=radio][name="saleskingpayoutMethod"]:checked').val(),
		            paypal: $('#paypal-email').val(),
		            custom: $('#custom-method').val(),
		            bankholdername: $('#bank-account-holder-name').val(),
			bankname: $('#bank-name').val(),
			branchcode: $('#bank-branch-code').val(),
			accountnumber: $('#bank-account-number').val(),
			iban: $('#bank-iban').val(),
		        };


		        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
		        	window.location.reload();
		        });
		    }
		});

		// save user profile settings
		$('#salesking_save_settings').on('click', function(){	
			var datavar = {
	            action: 'salesking_save_profile_settings',
	            security: salesking_display_settings.security,
	            announcementsemails: $('#new-announcements').is(":checked"),
	            messagesemails: $('#new-messages').is(":checked"),
	            userid: $(this).val(),
	        };


	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	window.location.reload();
	        });

		});

		$('#salesking_update_profile1').on('click', function(){	
			var datavar = {
	            action: 'salesking_save_profile_info',
	            security: salesking_display_settings.security,
	            firstname: $('#first-name').val(),
	            lastname: $('#last-name').val(),
	            displayname: $('#display-name').val(),
	            emailad: $('#email').val(),
	        };

	        $.post(salesking_display_settings.ajaxurl, datavar, function(response){
	        	window.location.reload();
	        });

		});

		$('#salesking_update_profile').on('click', function () {
    var datavar = {
        action: 'salesking_save_profile_info',
        security: salesking_display_settings.security,
        firstname: $('#first-name').val(),
        lastname: $('#last-name').val(),
        agent_shop_name: $('#agent_shop_name').val(),
        agent_contract_number: $('#agent_contract_number').val(),
        agent_contract_start: $('#agent_contract_start').val(),
        agent_contract_end: $('#agent_contract_end').val(),
        agent_shop_phone: $('#agent_shop_phone').val(),
        agent_province: $('#agent_province').val(),
        agent_city: $('#agent_city').val(),
        agent_address: $('#agent_address').val(),
        agent_postcode: $('#agent_postcode').val(),
    };

    $.post(salesking_display_settings.ajaxurl, datavar, function (response) {
        window.location.reload();
    });
});


		// checkout registration
		if (parseInt(salesking_display_settings.ischeckout) === 1){
			showHideCheckout();
			$('#createaccount').change(showHideCheckout);
		}

		function showHideCheckout(){
			if($('#createaccount').prop('checked') || typeof $('#createaccount').prop('checked') === 'undefined') {
		    	$('input[name="salesking_registration_link"]').parent().css('display','block');
		    } else {      
		    	$('input[name="salesking_registration_link"]').parent().css('display','none');

		    }
		}	
		

	});

})(jQuery);
