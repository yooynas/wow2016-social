/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
(function($) {

	// jQuery plugin to encapsule a conversation control.  Add a callback to the options passed in
	// called 'add_passage_callback' to be called when a passage is added to the chat.
	var ChatContainer = function(el, options) {
		this.$el = $(el);
		this.options = {
			input_element : '#chat-input-message'
		};
		this.options = $.extend(this.options, options);
		this.next_side = 'left';
		this.init();
	}

	ChatContainer.prototype.init = function() {
		this.initContainer();

		$('#btn-chat-append').on('click', this, newPassageHandler);

	}

	ChatContainer.prototype.initContainer = function() {

		this.$el.empty();

		var container = $([
          '<div class="chat-panel panel panel-info">',
              '<div class="chat-panel-body panel-body">',
                  '<ul class="chat">',
                  '</ul>',
              '</div>',
              '<div class="panel-footer">',
                  '<div class="input-group">',
                      '<input id="chat-input-message" type="text" class="form-control" placeholder="Chat with Watson here...">',
                      '<span class="input-group-btn">',
                          '<button class="btn btn-warning btn-sm" id="btn-chat-append">',
                              'Send</button>',
                      '</span>',
                  '</div>',
              '</div>',
          '</div>'
		].join(''));

		this.$container = container;
		this.$el.append(this.$container);
		this.$chat = this.$container.find('.chat');

		$("#chat-input-message").keyup(function(event){
		    if(event.keyCode == 13) {
		        $("#btn-chat-append").click();
		    }
		});
	}

	ChatContainer.prototype.reset = function() {
		this.init();
	}

	ChatContainer.prototype.addPassageLeft = function(text) {
		if (text.trim().length === 0) {
			return;
		}

		var passage_html = $([
			'<li class="left clearfix">',
        '<div class="chat-body clearfix">',
            '<p>',
             	text,
            '</p>',
        '</div>',
      '</li>'
		].join(''));

		this.$chat.append(passage_html);

		this.$container.find(this.options.input_element).val('');

		var chat_scroll = $('.chat-panel-body');
  		var height = chat_scroll[0].scrollHeight;
  		chat_scroll.scrollTop(height);

		if (this.options.add_passage_callback) {
			this.options.add_passage_callback(text);
		}
	}

	ChatContainer.prototype.addPassageRight = function(text) {
		var passage_html = $([
			'<li class="right clearfix">',
        '<div class="chat-body clearfix">',
            '<p>',
            	'<img class="vcenter" src="/images/IBM_Watson_avatar_simple_2color.png" height="20px"> </img>',
             	text,
            '</p>',

        '</div>',
      '</li>'
		].join(''));

		this.$chat.append(passage_html);

		this.$container.find(this.options.input_element).val('');

		var chat_scroll = $('.chat-panel-body');
		var height = chat_scroll[0].scrollHeight;
		chat_scroll.scrollTop(height);
	}

	var newPassageHandler = function(e) {
		var chat_container = e.data;

		chat_container.addPassageLeft($('#chat-input-message').val());

	}

	$.fn.extend({
      initChatContainer: function(options) {
      	var chat = new ChatContainer(this, options);
      	return chat;
      }
    });
})(jQuery);
