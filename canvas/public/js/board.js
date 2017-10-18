var ctx;
//socketIO 전역변수
var socket;
var selectShape;

//치명적 문제 1. 나중에 입장한 사람 캔버스는.....(숙연)
//내일 할 일 : 지우개! 그리고 원?네모?
//혹시 무아즈 아저씨 예제처럼.. 여기에 텍스트 박스를 구현할 수 있으면 이더패드가 굳이 필요없지 않을까...?아닌가...
//텍스트박스는 왠지 구현할 수 있을것 같은 안좋은 근자감이 든다

$(document).ready(function(){
    //jQuery 이용하여 canvas element 객체 얻기
    //ctx = $('#cv').get(0).getContext('2d');
    ctx = document.getElementById("cv").getContext("2d");

    //jQuery bind 이용하여 canvas에 마우스 시작,이동,끝 이벤트 핸들러 등록
    $('#cv').bind('mousedown',draw.start); //왜 이건 document.으로 못 부르는지.....
    $('#cv').bind('mousemove',draw.move);
    $('#cv').bind('mouseup',draw.end);

    //기본 모양 색상 설정
    shape.setShape();

    //clear 버튼에 이벤트 핸들러 등록
    $('#clear').bind('click',draw.clear);

    //색상 선택 select 설정
    for(var select in color_map){
        $('#pen_color').append('<option value=' + color_map[select].value + '>' +  color_map[select].name + '</option>');
    }
    //색상 선택 select 설정
    for(var i = 2 ; i < 15 ; i++){
        $('#pen_width').append('<option value=' + i + '>' +  i + '</option>');
    }
    for(var select in shape_map){
        $('#draw_shape').append('<option value=' + shape_map[select].value + '>' +  shape_map[select].name + '</option>');
    } //얘는 나중에..
    $('select').bind('change',shape.change);


    socket = io.connect('http://' + window.location.host);
    socket.on('linesend_toclient', function (data) { //데이터 전달 받음
        draw.drawfromServer(data);
    });
});

var msg = {
    line : {
        send : function(type,x,y){
            //console.log(type,x,y);
            socket.emit('linesend', {'type': type , 'x':x , 'y':y , 'color': shape.color , 'width' : shape.width });
        }
    }
}

//색상 배열
var color_map =
    [
        {'value':'white','name':'하얀색'},
        {'value':'red','name':'빨간색'},
        {'value':'orange','name':'주황색'},
        {'value':'yellow','name':'노란색'},
        {'value':'blue','name':'파랑색'},
        {'value':'black','name':'검은색'}
    ];

var shape_map =
    [
        {'value':'pen','name':'펜'},
        {'value':'rect','name':'사각형'},
        {'value':'circle','name':'원'},
        {'value':'line','name':'직선'},
    ];

var shape = {

    //기본 색상,두께 설정
    color : 'white',
    width : 3,
    selectShape : 'line',
    change : function(){
        var color = $('#pen_color option:selected').val();
        var width = $('#pen_width option:selected').val();
        shape.setShape(color,width);
    },

    //변경
    setShape : function(color,width){
        if(color != null)
            this.color = color;
        if(width != null)
            this.width = width;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;

        //미리보기
        /*
        ctx.clearRect(703, 0, 860, 90);
        ctx.beginPath();
        ctx.moveTo(710,55);
        ctx.lineTo(820,55);
        ctx.stroke();
        */
    }
}
//그리기
var draw = {
    drawing : null,
    start : function(e){
        ctx.beginPath();
        ctx.moveTo(e.pageX,e.pageY);
        this.drawing = true;
        msg.line.send('start',e.pageX,e.pageY);
    },
    move : function(e){
        if(this.drawing){
            ctx.lineTo(e.pageX,e.pageY);
            ctx.stroke();
            msg.line.send('move',e.pageX,e.pageY);
        }
    },
    end : function(e){
        this.drawing = false;
        msg.line.send('end');
    },
    clear : function(){
        //전체 지우기
        ctx.clearRect(0, 0, cv.width,cv.height);
        shape.setShape();
        msg.line.send('clear');
    },

    //그린 내용 남의 브라우저에도 그려주기
    drawfromServer : function(data){

        if(data.type == 'start'){
            ctx.beginPath();
            ctx.moveTo(data.x,data.y);
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.width;
        }

        if(data.type == 'move'){
            ctx.lineTo(data.x,data.y);
            ctx.stroke();
        }

        if(data.type == 'end'){
        }

        if(data.type == 'clear'){
            ctx.clearRect(0, 0, cv.width,cv.height);
            shape.setShape();
        }
    }
}

function saveCanvas() {
    var canvas = document.getElementById("cv");
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    $('.save').attr({
        'download': 'YourProduct.png',  /// set filename
        'href'    : image              /// set data-uri
    });

    console.log("저장 성공");
}
