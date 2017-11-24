//
var user_id = prompt("사용자 ID를 입력하세요", "default");
var chamber_name = prompt("소속된 챔버명을 입력하세요", "redpoint");
var user_color = prompt("이더패드에 사용할 유저 컬러를 입력하세요 으아아ㅏㅏㅏ호롤로");

$(document).ready(function() {
    var button = document.getElementById('btn-docs-download');
    var FileDownLink = "https://localhost:9001/p/" + chamber_name + "/export/txt";
    button.href = FileDownLink;

});

//calling canvas
(function( $ ){
    $.fn.canvas = function() {
        var iFrameLink = '<iframe id="canvas"';
            iFrameLink = iFrameLink + 'src="https://localhost:3001?chamber=' +chamber_name;
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
            'host'              : 'https://localhost:9001',
            'baseUrl'           : '/p/',
            'userName'          : user_id,
            'userColor'         : user_color,
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
            iFrameLink = iFrameLink + '&userName=' + settings.userName;
            iFrameLink = iFrameLink + '&userColor=' + settings.userColor;
            iFrameLink = iFrameLink +'" width="' + '100%';
            iFrameLink = iFrameLink +'" height="' + '100%;';
            iFrameLink = iFrameLink +'"></iframe>';

            //var FileDownLink = '<iframe src="https://localhost:9001/p/' + settings.padId + '/export/txt"></iframe>'

            var $iFrameLink = $(iFrameLink);
            $self.html(iFrameLink);
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

(function( $ ){
    $.fn.download = function() {
        var FileDownLink = '<iframe src="https://localhost:9001/p/' + chamber_name + '/export/txt"></iframe>'
        var $FileDownLink = $(FileDownLink);

        var $self = this;
        $self.html(FileDownLink);
    };

    return;
})( jQuery );