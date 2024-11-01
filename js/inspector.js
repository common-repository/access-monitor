jQuery( document ).ready( function( $ ) {
	var status = $( '#am_status' ).val();
	if ( status == 'new' ) {
		$( '#publish[name="publish"]' ).attr( 'disabled', 'disabled' ).removeClass( 'button-primary' ).addClass( 'button-secondary' );
		$( '#save-post' ).addClass( 'button-primary' );
		$( '#save-post' ).on( 'click', function( e ) {
			$( '#publish[name="publish"]' ).attr( 'disabled', false ).removeClass( 'button-secondary' ).addClass( 'button-primary' );
			$( '#save-post' ).removeClass( 'button-primary' );
		});
	}
	
	// toggle publish button based on override condition
	$( '#am_override' ).on( 'change', function( e ) {
		if ( $( '#am_override' ).is( ':checked' ) ) {
			$( '#publish[name="publish"]' ).attr( 'disabled', false ).removeClass( 'button-secondary' ).addClass( 'button-primary' );
			$( '#save-post' ).removeClass( 'button-primary' );
		} else {
			$( '#publish[name="publish"]' ).attr( 'disabled', 'disabled' ).removeClass( 'button-primary' ).addClass( 'button-secondary' );
			$( '#save-post' ).addClass( 'button-primary' );
		}
	});
	
	$( '#publish[name="publish"], button.inspect-a11y' ).on( 'click', function( e ) {
		var override = $( '#am_override' ).is( ':checked' );
		if ( override ) {
			// exit without testing
		} else {
			var preview_url = $( '#post-preview' ).attr( 'href' );
			var preview_content = '';
			var preview_container = ( amp.container == '' ) ? 'body' : amp.container;
			var response_content = '';
			var grade = 0;
			e.preventDefault();

			$.ajax({
			   url:preview_url,
			   type:'post',
			   success: function(data){
					preview_content = $(data).find( preview_container ).html();
					if ( ! preview_content || preview_content == '' ) {
						preview_content = amp.failed;
					}

					var query = {
						'action' : amp.ajax_query,
						'tenon' : preview_content,
						'level' : amp.level,
						'certainty' : amp.certainty,
						'priority' : amp.priority,
						'fragment' : '1'
					};

					$.ajax({
						type:'post',
						data: query,
						url: amp.ajax_url,
						dataType: 'json',
						success: function( data ) {
							response_content = data.formatted;
							var err = response_content.search( 'Tenon error' );
							grade = data.grade;
							if ( grade == '0' ) {
								$( '#am-errors' ).html( response_content );
								$( '.am-errors .am-message' ).html( amp.error );
								console.log( data.errors );
								$( '.am-errors .warnings' ).text( data.errors.warnings );
								$( '.am-errors .errors' ).text( data.errors.errors );
								$( '.am-errors .levela' ).text( data.errors.levela );
								$( '.am-errors .levelaa' ).text( data.errors.levelaa );
								$( '.am-errors .levelaaa' ).text( data.errors.levelaaa );
								if ( err > -1 ) {
									$( '.am-errors' ).addClass( 'updated error' ).html( response_content ).show().attr( 'tabindex', '-1' ).trigger('focus');
								} else {
									$( '.am-errors' ).addClass( 'updated error' ).show().attr( 'tabindex', '-1' ).trigger('focus');
								}
							} else {
								if ( e.target.nodeName == 'INPUT' ) {
									$( '#ampublish' ).click();
								} else {
									console.log( am );
									$( '#am-errors' ).html( response_content );
									$( '.am-errors .warnings' ).text( amp.warnings );
									$( '.am-errors .errors' ).text( amp.errors );
									$( '.am-errors .levela' ).text( amp.levela );
									$( '.am-errors .levelaa' ).text( amp.levelaa );
									$( '.am-errors .levelaaa' ).text( amp.levelaaa );
									$( '.am-errors .am-message' ).html( amp.pass );
									$( '.am-errors' ).addClass( 'updated error' ).show().attr( 'tabindex', '-1' ).trigger('focus');
								}
							}
						},
						error: function( data ) {
							if ( e.target.nodeName == 'INPUT' ) {
								$( '#post' ).submit();
							}
						}
					});
					
					return false;
			   },
			   error: function( data ) {
					$( '.am-errors' ).addClass( 'updated error' ).show().html( amp.ajaxerror ).attr( 'tabindex', '-1' ).trigger('focus');
			   }
			});
		}
	});

	$( '#am_notify' ).on( 'click', function( e ) {
		var query = {
			'action'  : amp.ajax_notify,
			'user'    : amp.user,
			'post_ID' : amp.post_ID, 
			'security': amp.security
		};

		$.ajax( {
			type: 'POST',
			url: amp.ajax_url,
			data: query,
			dataType: 'json',
			success: function( data ) {
				var response = data.response;
				var message = data.message;
				$( '#am_notified' ).html( message );
			},
			error: function(data) {
				$( '#am_notified' ).html( amp.send_error );
			}
		});
	});

	$( '.am-toggle' ).on( 'click', function(e) {
		e.preventDefault();
		$( '#am-errors' ).toggle();
		var expanded = $( this ).attr( 'aria-expanded' );
		if ( expanded == 'false' ) {
			$( this ).text( amp.hide ).attr( 'aria-expanded', 'true' );
		} else {
			$( this ).text( amp.show ).attr( 'aria-expanded', 'false' );
		}
	});
});