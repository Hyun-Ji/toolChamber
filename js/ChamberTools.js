//
var user_id = prompt("사용자 ID를 입력하세요", "default");
var chamber_name = prompt("소속된 챔버명을 입력하세요", "redpoint");

//calling canvas
(function( $ ){
    $.fn.canvas = function() {
        var iFrameLink = '<iframe id="canvas"';
            iFrameLink = iFrameLink + 'src="http://0.0.0.0:3000?chamber=' +chamber_name;
            iFrameLink = iFrameLink + '&userName=' + user_id;
            iFrameLink = iFrameLink +'" width="' + '100%';//settings.width;
            iFrameLink = iFrameLink +'" height="' + '100%;';//settings.height;
            iFrameLink = iFrameLink +'"></iframe>';

        var $iFrameLink = $(iFrameLink);

        var $self = this;
        $self.html(iFrameLink);
    };

})( jQuery );

//calling etherpad
(function( $ ){

    $.fn.pad = function( options ) {
        var settings = {
            //'host'              : 'http://beta.etherpad.org',
            'host'              : 'http://0.0.0.0:9001',
            'baseUrl'           : '/p/',
            'showControls'      : true,
            'showChat'          : false,
            'showLineNumbers'   : true,
            'userName'          : user_id,
            'lang'              : '',
            'useMonospaceFont'  : false,
            'noColors'          : false,
            'userColor'         : true,
            'hideQRCode'        : false,
            'alwaysShowChat'    : false,
            'border'            : 0,
            'borderStyle'       : 'solid',
            'toggleTextOn'      : 'Disable Rich-text',
            'toggleTextOff'     : 'Enable Rich-text',
            'plugins'           : {},
            'rtl'               : false,
            'padId'             : chamber_name    };

        var $self = this;
        if (!$self.length) return;
        if (!$self.attr('id')) throw new Error('No "id" attribute');

        var useValue = $self[0].tagName.toLowerCase() == 'textarea';
        var selfId = $self.attr('id');
        var epframeId = 'epframe'+ selfId;
        // This writes a new frame if required
        if ( !options.getContents ) {
            if ( options ) {
                $.extend( settings, options );
            }

            var pluginParams = '';
            for(var option in settings.plugins) {
                pluginParams += '&' + option + '=' + settings.plugins[option]
            }

            var iFrameLink = '<iframe id="'+epframeId;
            iFrameLink = iFrameLink +'" name="' + epframeId;
            iFrameLink = iFrameLink +'" src="' + settings.host+settings.baseUrl+settings.padId;
            iFrameLink = iFrameLink + '?showControls=' + settings.showControls;
            iFrameLink = iFrameLink + '&showChat=' + settings.showChat;
            iFrameLink = iFrameLink + '&showLineNumbers=' + settings.showLineNumbers;
            iFrameLink = iFrameLink + '&useMonospaceFont=' + settings.useMonospaceFont;
            iFrameLink = iFrameLink + '&userName=' + settings.userName;
            if (settings.lang) {
                iFrameLink = iFrameLink + '&lang=' + settings.lang;
            }
            iFrameLink = iFrameLink + '&noColors=' + settings.noColors;
            iFrameLink = iFrameLink + '&userColor=' + settings.userColor;
            iFrameLink = iFrameLink + '&hideQRCode=' + settings.hideQRCode;
            iFrameLink = iFrameLink + '&alwaysShowChat=' + settings.alwaysShowChat;
            iFrameLink = iFrameLink + '&rtl=' + settings.rtl;
            iFrameLink = iFrameLink + pluginParams;
            iFrameLink = iFrameLink +'" style="border:' + settings.border;
            iFrameLink = iFrameLink +'; border-style:' + settings.borderStyle;
            iFrameLink = iFrameLink +';" width="' + '100%';//settings.width;
            iFrameLink = iFrameLink +'" height="' + '100%;';//settings.height;
            iFrameLink = iFrameLink +'"></iframe>';


            var $iFrameLink = $(iFrameLink);

            if (useValue) {
                var $toggleLink = $('<a href="#'+ selfId +'">'+ settings.toggleTextOn +'</a>').click(function(){
                    var $this = $(this);
                    $this.toggleClass('active');
                    if ($this.hasClass('active')) $this.text(settings.toggleTextOff);
                    $self.pad({getContents: false});
                    return false;
                });
                $self
                    .hide()
                    .after($toggleLink)
                    .after($iFrameLink)
                ;
            }
            else {
                $self.html(iFrameLink);
            }
        }

        // This reads the etherpad contents if required
        else {
            var frameUrl = $('#'+ epframeId).attr('src').split('?')[0];
            var contentsUrl = frameUrl + "/export/html";
            var target = $('#'+ options.getContents);

            // perform an ajax call on contentsUrl and write it to the parent
            $.get(contentsUrl, function(data) {

                if (target.is(':input')) {
                    target.val(data).show();
                }
                else {
                    target.html(data);
                }

                $('#'+ epframeId).remove();
            });
        }


        return $self;
    };
})( jQuery );

//calling canvas
