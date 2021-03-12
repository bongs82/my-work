
(function( $ , window )
{
    if( !window.commonJs )
    {
        window.commonJs = {};
    }
    var commonJs = window.commonJs;
    //commonJs.formReoad = formReoad;
    var doc;
    var body;
    var winHeight = 0;
    var winWidth = 0;

    commonJs.openScreen = function(data, isPop, screenNo){
        var gotoURL = "ns://webpop.shinhaninvest.com?data="+data+"&isPop="+isPop+"&path="+screenNo;
        location.href=gotoURL;
    }

    function lowMode()
    {
        //return true;
        var x = navigator.userAgent;
        var index = x.indexOf('Android');
        if(index==-1) return false; //������ �б� ó��.
        var and_v = eval(x.substr(index+8,1));
        //console.log( and_v);
        var check = false;
        if( and_v < 3){
            check = true;
        }
        return check;
    }

    commonJs.graph ={}

    // 3���� �޸����
    var comma = function(str){
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    };

    var degreesToRadians = function(degrees){
       return degrees * (Math.PI/180);
    };

    var radiansToDegrees = function(radians) {
       return radians * (180/Math.PI);
    };

    commonJs.graph.xTextAlign = function( opt )
    {
        var chValue     =   commonJs.graph.changeValue;
        var stX         =   opt.startX
        var graphW      =   opt.graphW;
        var arr         =   opt.vArr;
        var p           =   graphW/(arr.length-1);
        var type        =   opt.type;

        var txtArr      =   opt.textArr;
        var txtV        =   [];

        for( var i =0; i<txtArr.length; i++)
        {
            // ������ ���� �Ǵ� ��Ŀ� �з�
            if( type == 'type1')
            {
                txtV.push(  Math.floor( ((i)/(txtArr.length))*(arr.length) ));
            }else{
                txtV.push(  Math.floor( ((i)/(txtArr.length-1))*(arr.length-1) ));
            }
        }

        for( var i =0; i<arr.length; i++)
        {
            for( var j=0; j<txtV.length; j++)
            {
                if( i == txtV[j]){

                    var t   =   new createjs.Text( txtArr[j], opt.textType , opt.textColor);
                    t.x = stX+(i*p);

                    t.textAlign=opt.textAlign;
                    opt.target.addChild(t);
                }
            }
        }
    }
    commonJs.graph.yTextAlign = function( opt )
    {
        var h = opt.graphH/opt.textArr.length;
        var align = (opt.textAlign)?opt.textAlign:'right';
        for(var i =0; i<opt.textArr.length; i++)
        {
            var m = new createjs.Text(opt.textArr[i],opt.textType,opt.textColor);
            m.y = i*-h;
            m.textAlign=align;
            opt.target.addChild(m);
        }
    }
    commonJs.graph.changeValue = function(cn,to,ch)
    {
        return (cn/to)*ch;
    }


    var canvasFirst = false,rW,rH;
    commonJs.graph.Resize = function(opt)
    {
        var img = opt.img;
        if( !lowMode() ){
            return
        }
        var canvas = opt.canvas;
        var img = opt.img;
        var content = opt.content;
        var stage = opt.stage;

        if( !canvasFirst ){
            rW = canvas.get(0).width;
            rH = canvas.get(0).height;
        }

        var sW = img.width();
        var s = sW/rW;
        var sH = rH*s;

        content.scaleX = s;
        content.scaleY = s;

        stage.canvas.width = sW;
        stage.canvas.height = sH;
        canvasFirst = true;
    }

    function drawLine(opt)
    {
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;

        var line        =   new Shape();
        var graphW      =   opt.graphW;
        var graphH      =   opt.graphH;
        var dot         =   opt.dot;

        var min         =   opt.min;
        var max         =   opt.max;
        var stY         =   opt.startY;
        var stX         =   opt.startX
        var arr         =   opt.value;
        var p           =   graphW/(arr.length-1);
        var type        =   opt.type;

        line.graphics.ss(opt.lineW).s(opt.color);

        if( dot ){
            var dotV        =   [];
            for( var i =0; i<dot.length; i++)
            {
                if( type == 'type1')
                {
                   dotV.push(  Math.floor((i/(dot.length))*(arr.length)) );
                }else{
                   dotV.push(  Math.floor((i/(dot.length-1))*(arr.length-1)) );
                }
            }
        }

        for( var i =0; i<arr.length; i++)
        {
            line.graphics.lineTo( stX+(i*p) , stY-chValue(arr[i]-min,max-min,graphH) );

            if(dot){
                for( var j=0; j<dot.length; j++)
                {



                    if( i == dotV[j]){
                        var d    = dot[j];
                        d.x = stX+(i*p);
                        d.y = stY-chValue(arr[i]-min,max-min,graphH);
                    }
                }
            }
        }
        line.graphics.es();
        opt.target.addChild(line);

        if(dot){
            for(var i=0; i<dot.length; i++)
            {
                opt.target.addChild(dot[i]);
            }
        }
    }

    // Array.prototype
    function drawCircle(opt)
    {
        var ctjs        = createjs;
        var Container   = ctjs.Container;
        var Bitmap      = ctjs.Bitmap;
        var Shape       = ctjs.Shape;
        var chValue     = commonJs.graph.changeValue;

        var START   =   -90;
        var canvas  =   opt.canvas;
        var stage   =   opt.stage;
        var x       =   opt.x;
        var y       =   opt.y;
        var radius  =   opt.radius;
        var circle  =   opt.circle;
        var stroke  =   opt.stroke;
        var vArr    =   opt.array;
        var content =   opt.content;
        var stn = 0;

        var tarr = [];

        // -�� ����ó����
        min = Math.abs(min)*2;
        for(var i = 0; i<vArr.length; i++)
        {
          tarr.push(vArr[i].value);
        }
        var min = function arrayMin(arr) {
          return arr.reduce(function (p, v) {
            return ( p < v ? p : v );
          });
        }(tarr);
        var add = function arrayMin(arr) {
          return arr.reduce(function (p, v) {
            return ( p + v);
          });
        }(tarr);
        min = Math.abs(min)*2;

        var cArr = [];
        for(var i=0; i<tarr.length; i++)
        {
          var n = 0;
          if( Math.abs(tarr[i])>0 )
          {
            n = tarr[i]+min;
          }
          cArr.push(n);
        }
        var max = function arrayMin(arr) {
          return arr.reduce(function (p, v) {
            return ( p + v);
          });
        }(cArr);
         //console.log(cArr);

        for( var i =0; i<vArr.length; i++)
        {
            var info = vArr[i];
            var tmp = new Shape();

            tmp.graphics.ss(stroke).s('white');
            if(!info.img){
                tmp.graphics.f(info.color);
            }else{
                //console.log('sss ',info.img)
                //tmp.graphics.f('#123123');
                tmp.graphics.beginBitmapFill( info.img  );
            };

            // console.log(  info.value)
            tmp.graphics.arc(x, y, radius, degreesToRadians(START+chValue(stn,max,360)), degreesToRadians(START+chValue(cArr[i]+stn,max,360)), false).lt(x, y).cp();
            stn +=  cArr[i];
            content.addChild(tmp);
        }

        var w = new Shape();
        //w.graphics.s('black').f('#ffffff').arc(x, y, circle, degreesToRadians(0), degreesToRadians(360), false).lt(x, y).cp();
        w.graphics.f('#ffffff').arc(x, y, circle, degreesToRadians(0), degreesToRadians(360), false).lt(x, y).cp();
        content.addChild(w);

        if( !lowMode() ){
            //
            var s = new createjs.Shape();
            var g = s.graphics;
            s.angle = 360;
            s.radius = radius/2;
            s.thickness = radius;
            s.color = '#ffffff'
           //s.color = 'black'
            var tween = createjs.Tween.get(s, {loop:false}).to({angle:0}, 1000, createjs.Ease.circInOut).call(function()
            {
                s.graphics.clear();
                s.visible = false;
                createjs.Ticker.removeEventListener("tick", tick);
                tween.removeEventListener("change", handleChange);
            });

            tween.addEventListener("change", handleChange);
            //s.graphics.ss(s.thickness).s(s.color).arc(x, y, radius, 0, 360, false);
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener("tick", tick);
            content.addChild(s);
        }

        function handleChange(event)
        {
            var start = -90*Math.PI/180;
            var s = event.target.target;
            s.angle += 1;
            var endAngle = (s.angle) * Math.PI / 180;
            s.graphics.clear();
            s.graphics.ss(s.thickness).s(s.color).arc(x, y, s.radius, 0+start, endAngle+start, false);
        }
        //content.addChild(pos);
        // ���ػ� ��������
        stage.addChild(content);
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })
        stage.update();

        function tick()
        {
            stage.update();
        }
    }

    function rectMaskAnimation( target , mask )
    {
        target.mask = mask;
        var oW  = mask.width;
        mask.width = 0;
        //graph.width = 0;
        var tween = createjs.Tween.get(mask, {loop:false});
        tween.wait(0).to({width:oW}, 700, createjs.Ease.circInOut)
        .call(function()
        {
            target.dispatchEvent('complete');
            tween.removeEventListener('change',changeH);
        })
        .addEventListener('change', changeH);

        function changeH(evt)
        {
            var g = evt.target.target;
            g.graphics.clear();
            g.graphics.f('black').dr(0,0,g.width,mask.height);
        }
    }

    function infobox(opt,arr)
    {
        var Container   =   createjs.Container;
        var Shape       =   createjs.Shape;
        var Text        =   createjs.Text;
        var x       =   opt.x;
        var y       =   opt.y;
        var tArr    =   arr;
        //var perV    =   opt.perV;
        var perV    =   opt.perV;
        var target  =   opt.target;
        var valueV  =   opt.valueV;         // ���� 0�ϰ�� �Ⱥ��̰� �Ұ����� ���� : true ���̰� , false : �Ⱥ��̰�

        var title = new Container();
        title.x = x;
        title.y = y;
        var cn = 0;
        var height = 0;
        for( var i=0; i<tArr.length; i++)
        {
            var obj = tArr[i];
            var tm = new Container();
            if( Math.abs(obj.value) > 0 || valueV){
                var dot = new Shape();
                dot.graphics.f(obj.color).arc(0, 0, 10, 0, 360, false);
                dot.y = 20;

                var txt = new Text(obj.title,'42px sdsGnsb','#262626');
                tm.y = height;
                height += txt.getBounds().height+20;

                txt.x = 30;

                if(perV){
                    var tvalue  =   new Text(obj.value.toFixed(2)+'%','42px Arial','#262626');
                    tvalue.textAlign='right';
                    tvalue.x = 445;
                    tvalue.y = 0;
                    tm.addChild(tvalue);
                }

                tm.addChild(dot);
                tm.addChild(txt);
                title.addChild(tm);
                cn++;
           }
        }
        target.addChild(title);
    }

    function infobox2(opt,arr)
    {
        var Container   =   createjs.Container;
        var Shape       =   createjs.Shape;
        var Text        =   createjs.Text;
        var x       =   opt.x;
        var y       =   opt.y;
        var tArr    =   arr;
        //var perV    =   opt.perV;
        var perV    =   opt.perV;
        var target  =   opt.target;
        var valueV  =   opt.valueV;         // ���� 0�ϰ�� �Ⱥ��̰� �Ұ����� ���� : true ���̰� , false : �Ⱥ��̰�
        var title = new Container();
        title.x = x;
        title.y = y;
        var cn = 0;
        var height = 0;
        var width = 0;
        for( var i=0; i<tArr.length; i++)
        {
            var obj = tArr[i];
            var tm = new Container();
            if( Math.abs(obj.value) > 0 || valueV){
                var dot = new Shape();
                dot.graphics.f(obj.color).arc(0, 0, 10, 0, 360, false)
                dot.y = 20;

                var txt = new Text(obj.title,'35px sdsGnsb','#262626');
                tm.x = width;
                width += txt.getBounds().width+50;

                txt.x = 20;

                if(perV){
                    var tvalue  =   new Text(obj.value+'%','42px Arial','#262626');
                    tvalue.textAlign='right';
                    tvalue.x = 445;
                    tvalue.y = -5;
                    tm.addChild(tvalue);
                }

                tm.addChild(dot);
                tm.addChild(txt);
                title.addChild(tm);
                cn++;
           }
        }
        target.addChild(title);
    }

    function infobox3(opt,arr)
    {
        var Container   =   createjs.Container;
        var Shape       =   createjs.Shape;
        var Text        =   createjs.Text;
        var x       =   opt.x;
        var y       =   opt.y;
        var tArr    =   arr;
        //var perV    =   opt.perV;
        var perV    =   opt.perV;
        var target  =   opt.target;
        var valueV  =   opt.valueV;         // ���� 0�ϰ�� �Ⱥ��̰� �Ұ����� ���� : true ���̰� , false : �Ⱥ��̰�
        var title = new Container();
        title.x = x;
        title.y = y;
        var cn = 0;
        var height = 0;
        for( var i=0; i<tArr.length; i++)
        {
            var obj = tArr[i];
            var tm = new Container();
            if( Math.abs(obj.value) > 0 || valueV){
                var dot = new Shape();
                dot.graphics.f(obj.color).rect(20, 2, 20, 20);
                dot.x = -7;
                dot.y = 5;

                var txt = new Text(obj.title,'24px sdsGnsb','transparent');
                    tm.y = height;
                    height += txt.getBounds().height+15;

                    txt.x = 30;

                if(perV){
                    var tvalue  =   new Text(obj.value+'%','bold 24px Arial','#262626');
                    tvalue.textAlign='left';
                    tvalue.x = 85;
                    tvalue.y = 5;
                    tm.addChild(tvalue);
                }

                tm.addChild(dot);
                tm.addChild(txt);
                title.addChild(tm);
                cn++;
           }
        }
        target.addChild(title);
    }

    // �������Ʈ
    commonJs.graph.assetCheckRadial = function(v1,v2,v3)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();

        canvas          =   $('#assetCheckRadial');
        stage           =   new createjs.Stage(canvas.get(0));
        var tri         =   new Shape();
        graph.addChild(tri);
        function drawPolygon( arr )
        {
            // n ���� ����
            var numSides = 3;
            //var radius = document.getElementById('radius').value;

            // x,y ��ǥ
            var xCenter = 0;
            var yCenter = 0;

            var angle = 11;
            var max = 250;

            var t1 = arr[0];
            arr.push(t1);
            var temp = [];
            for( var i = 0; i<arr.length; i++)
            {
                temp.push((arr[i]/5)*max );
            }

            var xPos = xCenter + temp[0] * Math.cos((2 * Math.PI * 0 / numSides)+angle);
            var yPos = yCenter + temp[0] * Math.sin((2 * Math.PI * 0 / numSides)+angle);
            tri.graphics.f('#3698d9');
            tri.graphics.moveTo(xPos,yPos);
            for (i = 1; i <= numSides; i++)
            {
                var ta = temp[i];
                xPos = xCenter + ta * Math.cos((2 * Math.PI * i / numSides)+angle);
                yPos = yCenter + ta * Math.sin((2 * Math.PI * i / numSides)+angle);
                tri.graphics.lineTo(xPos,yPos);
                var w = new Shape();
                w.graphics.f('#262626').arc(xPos, yPos, 12, degreesToRadians(0), degreesToRadians(360), false).lt(xPos, yPos).cp();
                graph.addChild(w);
            }
            tri.graphics.closePath();
            tri.graphics.lineWidth = 1;
        }

        drawPolygon( [v1,v2,v3] );
        tri.alpha=0.5;
        graph.x = 504;
        graph.y = 399;

        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage });
        if(!lowMode())
        {

            graph.angle = 100;
            graph.rotation = graph.angle;
            var tween = createjs.Tween.get(graph, {loop:false}).to({angle:0}, 400, createjs.Ease.circInOut).call(function()
            {
                createjs.Ticker.removeEventListener("tick", tick);
                tween.removeEventListener("change", handleChange);
            });

            tween.addEventListener("change", handleChange);

            function handleChange(evt)
            {
                var g = evt.target.target;
                graph.rotation = g.angle;
            }
             var tick = function(){
                stage.update();
            }
            createjs.Ticker.addEventListener('tick',tick);
        }
        content.addChild(graph);
        stage.addChild(content);
        stage.update();
    };

    //my > mygraph2.html
    commonJs.graph.assetCheckBar = function( v1,v2,v3)
    {
        var graph   =   doc.find('div.assetCheckBarJs>ul>li');
        var txt     =   ['�ſ쳷��','����','����','����','�ſ����'];
        var str     =   ['veryLow','low','normal','high','veryHigh'];
        var arr     =   arguments;

        graph.each( function( idx )
        {
            var div = $(this).children('div');
            div.removeAttr('class');
            var n = arr[idx]-1;
            div.addClass(str[n]);
            div.children('strong').text(txt[n]);

            // ��Ʈ �ִϸ��̼�
            var bar = div.children('span.grpBar');
            var w = bar.width();
            bar.css('width','0px');
            bar.stop().delay(idx*150).animate({'width': w +'px' },400,'easeInOutCirc');
        });
    }

    commonJs.graph.standardGraph = function(opt)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();

        canvas          =   $('#standardGraph');
        stage           =   new createjs.Stage(canvas.get(0));

        var stMin       =   opt.stMin;
        var stMax       =   opt.stMax;
        var seMin       =   opt.seMin;
        var seMax       =   opt.seMax;
        var startX      =   108;
        var startY      =   502;
        var graphH      =   373;
        var graphW      =   775;
        var lineW       =   3;
        var lineB       =   5;
        var color1      =   '#84bdf1';          // ����1
        var color2      =   '#5c75b6';          // ����2

        var yTxt1        =   new Container();
        yTxt1.x = 100;
        yTxt1.y = 490;

        // ����
        commonJs.graph.yTextAlign(
        {
            target      :   yTxt1,
            textArr     :   opt.stYarr,
            textType    :   '24px Arial',
            textColor   :   '#666666',
            graphH      :   graphH+70
        });

        var yTxt2        =   new Container();
        yTxt2.x = 900;
        yTxt2.y = 490;
        commonJs.graph.yTextAlign(
        {
            target      :   yTxt2,
            textArr     :   opt.seYarr,
            textType    :   '24px Arial',
            textColor   :   '#666666',
            textAlign   :   'left',
            graphH      :   graphH+70
        });

        var xTxt        =   new Container();
        //xTxt.x = 80;
        xTxt.y = startY+30;

        commonJs.graph.xTextAlign({
            target      :   xTxt,
            textArr     :   opt.xArr,
            textType    :   '24px Arial',
            textColor   :   '#666666',
            textAlign   :   'center',
            startX      :   startX,
            vArr        :   opt.stValue,
            graphW      :   graphW,
            type        :   'type2'
        });

        var dot1         =   new Shape();
        dot1.graphics.ss(lineW).s(color1).f('white').arc(0,0,6,-6,360,false);
        var dotArr1      =   [];
        for( var i =0; i<5; i++)
        {

            var tdot    =   new Shape();
            tdot        =   dot1.clone();
            tdot.width  =   5;
            dotArr1.push(tdot);
            //tdot.visible = (i==0)?false:true;
        }
        dotArr1[0].visible = false;
        dotArr1[4].visible = false;

        // ����
        var chart1       =   new Container();
        drawLine({
            target      :   chart1,
            color       :   color1,
            min         :   stMin,
            max         :   stMax,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr1,
            value       :   opt.stValue,
            startX      :   startX,
            startY      :   startY,
            type        :   'type2'
        });

        var dot2         =   new Shape();
        //dot.graphics.ss(lineW).s(color).f('white').dr(-5,-5,10,10);
        dot2.graphics.ss(lineW).s(color2).f('white').dr(-5,-5,10,10);
        var dotArr2      =   [];
        for( i =0; i<5; i++)
        {

            var tdot    =   new Shape();
            tdot        =   dot2.clone();
            tdot.width  =   5;
            dotArr2.push(tdot);
            //tdot.visible = (i==0)?false:true;
        }
        dotArr2[0].visible = false;
        dotArr2[4].visible = false;
        //console.log( stMin,stMax,seMin,seMax )

        // ����
        var chart2       =   new Container();
        drawLine({
            target      :   chart2,
            color       :   color2,
            min         :   seMin,
            max         :   seMax,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr2,
            value       :   opt.seValue,
            startX      :   startX,
            startY      :   startY,
            type        :   'type2'
        });

        graph.addChild(xTxt);
        graph.addChild(yTxt1);
        graph.addChild(yTxt2);
        var chart = new Container();
        chart.addChild(chart1);
        chart.addChild(chart2);
        graph.addChild(chart);
        content.addChild(graph);
        stage.addChild(content);
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        if( !lowMode() ){
             var mask = new Shape();
            mask.graphics.f('black').dr(0,0,100,600);
            mask.width=1000;
            mask.height=600;
            rectMaskAnimation(chart,mask);
            //rectMaskAnimation(chart2,mask);

            createjs.Ticker.setFPS(24);
            var tick = function(){
                stage.update();
            }
            createjs.Ticker.addEventListener('tick',tick);
            chart1.addEventListener('complete',function(){
                createjs.Ticker.removeEventListener('tick',tick);
            });
        }
        stage.update();
    }

    commonJs.graph.euroStoxxGraph   =   function(opt)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();

        canvas          =   $('#euroStoxxGraph');
        stage           =   new createjs.Stage(canvas.get(0));

        var min         =   opt.min;
        var max         =   opt.max;
        var startX      =   142;
        var startY      =   504;
        var graphH      =   367;
        var graphW      =   838;
        var lineW       =   3;
        var lineB       =   5;
        var color       =   '#3698d9';
        var first       =   opt.first;
        var next        =   opt.next;
        var end         =   opt.end;

        //���� ���ذ�
        var firstS      =   new Shape();
        firstS.graphics.ss(lineB).s('#92c15c').lineTo(0,0).lineTo(graphW,0).es();
        firstS.y        =   startY - chValue(first-min,max-min,graphH);
        firstS.x        =   startX;

        //���� �踮��
        var nextS       =   new Shape();
        nextS.graphics.ss(lineB).s('#716cbf').lineTo(0,0).lineTo(graphW,0).es();
        nextS.y        =   startY - chValue(next-min,max-min,graphH);
        nextS.x        =   startX;

        var endS        =   new Shape();
        endS.graphics.ss(lineB).s('#66b8cc').lineTo(0,0).lineTo(graphW,0).es();
        endS.y        =   startY - chValue(end-min,max-min,graphH);
        endS.x        =   startX;

        var yTxt        =   new Container();
        yTxt.x = 130;
        yTxt.y = 485;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr      :   opt.yArr,
            textType     :   '28px Arial',
            textColor    :   '#666666',
            graphH      :   graphH+42
        });

        var xTxt        =   new Container();
        //xTxt.x = 80;
        xTxt.y = startY+20;

        commonJs.graph.xTextAlign({
            target      :   xTxt,
            textArr     :   opt.xArr,
            textType    :   '28px Arial',
            textColor   :   '#666666',
            textAlign   :   'center',
            startX      :   startX,
            vArr        :   opt.value,
            graphW      :   graphW,
            type        :   'type1'
        });

        var dot         =   new Shape();
        //dot.graphics.ss(lineW).s(color).f('white').dr(-5,-5,10,10);
        dot.graphics.ss(lineW).s(color).f('white').arc(0,0,6,-6,360,false);
        var dotArr      =   [];
        for( var i =0; i<5; i++)
        {

            var tdot    =   new Shape();
            tdot        =   dot.clone();
            tdot.width  =   5;
            dotArr.push(tdot);

            tdot.visible = (i==0)?false:true;
        }

        var chart       =   new Container();
        //console.log(color)
        drawLine({
            target      :   chart,
            color       :   color,
            min         :   min,
            max         :   max,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr,
            value       :   opt.value,
            startX      :   startX,
            startY      :   startY,
            type        :   'type1'
        });

        graph.addChild(xTxt);
        graph.addChild(yTxt);
        graph.addChild(firstS);
        graph.addChild(nextS);
        graph.addChild(endS);

        content.addChild(graph);
        stage.addChild(content);
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        if( !lowMode() ){
             var mask = new Shape();
            mask.graphics.f('black').dr(0,0,100,600);
            mask.width=1000;
            mask.height=600;
            rectMaskAnimation(chart,mask);
            createjs.Ticker.setFPS(24);
            var tick = function(){
                stage.update();
            }
            createjs.Ticker.addEventListener('tick',tick);
            chart.addEventListener('complete',function(){
                createjs.Ticker.removeEventListener('tick',tick);
            });
        }

        graph.addChild(chart);
        stage.update();
    }

    commonJs.graph.fundBMgraph = function(opt)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();

        canvas          =   $('#fundBMgraph');
        stage           =   new createjs.Stage(canvas.get(0));

        var color1      =   '#5c75b6';
        var color2      =   '#84bdf1';
        var min         =   opt.min;
        var max         =   opt.max;
        var startX      =   80;
        var startY      =   306;
        var graphH      =   210;
        var graphW      =   900;
        var lineW       =   3;

        var arr1        =   opt.value1;
        var arr2        =   opt.value2;
        var dot1         =   new Shape();
        dot1.graphics.ss(lineW).s(color1).f('white').dr(-5,-5,10,10);

        var dot2         =   new Shape();
        if(arr2.length > 0) {
            dot2.graphics.ss(lineW).s(color2).f('white').arc(0,0,6,-6,360,false);
            dot2.x=100;
            dot2.y=170;
        }

        var xTxt        =   new Container();
        xTxt.y = 325;

        commonJs.graph.xTextAlign({
            target      :   xTxt,
            textArr     :   opt.xArr,
            textType    :   '16px Arial',
            textColor   :   '#666666',
            textAlign   :   'center',
            startX      :   startX,
            vArr        :   opt.value1,
            graphW      :   graphW,
            type        :   'type1'
        });

        var yTxt        =   new Container();
        yTxt.x = 68;
        yTxt.y = 295;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr      :   opt.yArr,
            textType     :   '16px Arial',
            textColor    :   '#666666',
            graphH      :   graphH+42
        });

        var dotArr1      =   [];
        for( var i =0; i<5; i++)
        {

            var tdot    =   new Shape();
            tdot        =   dot1.clone();
            tdot.width  =   5;
            dotArr1.push(tdot);

            tdot.visible = (i==0)?false:true;
        }

        var lineCont    =   new Container();
        drawLine({
            target      :   lineCont,
            color       :   color1,
            min         :   min,
            max         :   max,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr1,
            value       :   arr1,
            startX      :   startX,
            startY      :   startY,
            type        :   'type1'
        });

        var dotArr2      =   [];
        for( var i =0; i<5; i++)
        {
            var tdot    =   new Shape();
            tdot        =   dot2.clone();
            tdot.width  =   4;
            dotArr2.push(tdot);

            tdot.visible = (i==0)?false:true;
        }

        drawLine({
            target      :   lineCont,
            color       :   color2,
            min         :   min,
            max         :   max,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr2,
            value       :   arr2,
            startX      :   startX,
            startY      :   startY,
            type        :   'type1'
        });

        graph.addChild(xTxt);
        graph.addChild(yTxt);
        content.addChild(graph);
        stage.addChild(content);

        // ���ػ� ��� üũ
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage });

        if( !lowMode() ){
            var mask = new Shape();
            mask.graphics.f('black').dr(0,0,0,374);
            mask.width=1008;
            mask.height=374;
            rectMaskAnimation(lineCont,mask);
             var tick = function(){
                    stage.update();
            }
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener('tick',tick);
            lineCont.addEventListener('complete',function(){
                createjs.Ticker.removeEventListener('tick',tick);
            });
        }

        graph.addChild(lineCont);
        stage.update();
    }

    commonJs.graph.portfolioGraph = function( opt )
    {
        var heightGap = 206 //���� ��Ʈ���� ���� ���̸� ����
        var heightGap2 = 50 //���� ��Ʈ���� ���� ���̸� ����
        //mask.height �ø�

        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();

        canvas          =   $('#portfolioGraph');
        stage           =   new createjs.Stage(canvas.get(0));

        var color1      =   '#5c75b6';
        var color2      =   '#84bdf1';
        var min         =   opt.min;
        var max         =   opt.max;
        var startX      =   80;
        var startY      =   306 + heightGap;
        var graphH      =   210 + heightGap;
        var graphW      =   900;
        var lineW       =   3;

        var arr1        =   opt.value1;
        var arr2        =   opt.value2;
        var dot1         =   new Shape();
        dot1.graphics.ss(lineW).s(color1).f('white').dr(-5,-5,10,10);

        var dot2         =   new Shape();
        if(arr2.length > 0) {
            dot2.graphics.ss(lineW).s(color2).f('white').arc(0,0,6,-6,360,false);
            dot2.x=100;
            dot2.y=170;
        }

        var xTxt        =   new Container();
        xTxt.y = 325 + heightGap;

        commonJs.graph.xTextAlign({
            target      :   xTxt,
            textArr     :   opt.xArr,
            textType    :   '16px Arial',
            textColor   :   '#666666',
            textAlign   :   'center',
            startX      :   startX,
            vArr        :   opt.value1,
            graphW      :   graphW,
            type        :   'type1'
        });

        var yTxt        =   new Container();
        yTxt.x = 68;
        yTxt.y = 295 + heightGap;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr      :   opt.yArr,
            textType     :   '16px Arial',
            textColor    :   '#666666',
            graphH      :   graphH+42+heightGap2
        });

        var dotArr1      =   [];
        for( var i =0; i<5; i++)
        {

            var tdot    =   new Shape();
            tdot        =   dot1.clone();
            tdot.width  =   5;
            dotArr1.push(tdot);

            tdot.visible = (i==0)?false:true;
        }

        var lineCont    =   new Container();
        drawLine({
            target      :   lineCont,
            color       :   color1,
            min         :   min,
            max         :   max,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr1,
            value       :   arr1,
            startX      :   startX,
            startY      :   startY,
            type        :   'type1'
        });

        var dotArr2      =   [];
        for( var i =0; i<5; i++)
        {
            var tdot    =   new Shape();
            tdot        =   dot2.clone();
            tdot.width  =   4;
            dotArr2.push(tdot);

            tdot.visible = (i==0)?false:true;
        }

        drawLine({
            target      :   lineCont,
            color       :   color2,
            min         :   min,
            max         :   max,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr2,
            value       :   arr2,
            startX      :   startX,
            startY      :   startY,
            type        :   'type1'
        });

        graph.addChild(xTxt);
        graph.addChild(yTxt);
        content.addChild(graph);
        stage.addChild(content);

        // ���ػ� ��� üũ
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage });

        if( !lowMode() ){
            var mask = new Shape();
            mask.graphics.f('black').dr(0,0,0,374+100);
            mask.width=1008;
            mask.height=580; //374+100;
            rectMaskAnimation(lineCont,mask);
             var tick = function(){
                    stage.update();
            }
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener('tick',tick);
            lineCont.addEventListener('complete',function(){
                createjs.Ticker.removeEventListener('tick',tick);
            });
        }

        graph.addChild(lineCont);
        stage.update();
    }
    commonJs.graph.portfolioGraph01 = function( opt )
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        canvas          =   $(opt.canvas);
        stage           =   new createjs.Stage(canvas.get(0));

        var option      =   {
            canvas      :   canvas,
            stage       :   stage,
            content     :   content,
            x           :   opt.circleX,
            y           :   opt.circleY,
            radius      :   opt.outWidth,
            circle      :   opt.inWidth,
            stroke      :   0.01,
            array       :   []
        }

        for( var i = 0; i<opt.value.length; i++)
        {
            var v = opt.value[i];
            var t = opt.title[i];
            var c = opt.color[i];
            var obj = option.array[i] = {};

            obj.title = t;
            obj.value = v;
            obj.color = c;
        }

        drawCircle(option);
        var infoObj = {
            x       :   opt.titleX,
            y       :   opt.titleY,
            perV    :   opt.perV,
            valueV  :   opt.valueV,
            target  :   content
        }
        if(opt.info)
        {
            infobox3(infoObj,option.array);
        }

        stage.update();

        return content;
    }

    commonJs.graph.dateGraph = function(opt)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =    new Container();
        var Text        =   ctjs.Text;

        canvas          =   $('#dateGraph');
        stage           =   new createjs.Stage(canvas.get(0));

        var startX      =   110;
        var startY      =   320;
        var color       =   '#3698d9';
        var min         =   opt.min;
        var max         =   opt.max;
        var graphH      =   245;
        var graphW      =   850;
        var arr         =   opt.value;
        var p           =   graphW/(arr.length-1);

        var xTxt        =   new Container();
        //xTxt.x = 185;
        xTxt.y = 345;

        var yTxt        =   new Container();
        yTxt.x = 90;
        yTxt.y = 278;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr      :   opt.yArr,
            textType     :   '32px Arial',
            textColor    :   '#666666',
            graphH      :   310
        });

        var graph       =   new Container();

        drawLine({
            target      :   graph,
            color       :   color,
            min         :   min,
            max         :   max,
            lineW       :   4,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   null,
            value       :   arr,
            startX      :   startX,
            startY      :   320,
            type        :   'type1'
        });
        var dot1        =   new Shape();
        var dot2        =   new Shape();

        dot1.graphics.ss(4).s(color).f('white').arc(0, 0, 8, 0, 360, false);
        dot1.x = startX;
        dot1.y = startY-chValue(arr[0]-min,max-min,graphH);
        var txt1    =   new Text(opt.xArr[0],'32px Arial','#666666');
        txt1.x  =   startX;
        xTxt.addChild(txt1);

        dot2   = dot1.clone();
        dot2.x = startX + (p * (arr.length-1));
        dot2.y = startY-chValue(arr[arr.length-1]-min,max-min,graphH);

        var txt2    =   new Text(opt.xArr[1],'32px Arial','#666666');
        txt2.textAlign='right';
        txt2.x  =   dot2.x;
        xTxt.addChild(txt2);

        var mask = new Shape();
        mask.graphics.f('black').dr(0,0,0,415);
        mask.width=1000;
        mask.height=420;
        graph.addChild(dot1);
        graph.addChild(dot2);

        content.addChild(yTxt);
        content.addChild(xTxt);
        stage.addChild(content);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        if( !lowMode() ){
            rectMaskAnimation(graph,mask);
            graph.addEventListener('complete',function()
            {
                 createjs.Ticker.removeEventListener('tick',tick);
            });

            var tick = function(){
                stage.update();
            }
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener('tick',tick);
        }
        content.addChild(graph);
        stage.update();
    }

    commonJs.graph.simulation1 = function(v1 , v2 )
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var Text        =   ctjs.Text;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var textCont    =   new Container();
        var vColor1     =   '#887be4';
        var vColor2     =   '#1598dc';

        var textWidth   =   555;

        canvas = $("#simulation1");
        stage = new createjs.Stage(canvas.get(0));

        var total = v1+v2;

        var a1 = (v1/total)*100;
        var a2 = (v2/total)*100;

        var totalT      =   new Text('��ջ�Ȱ��','42px sdsGnsb','#262626');
        var totalV      =   new Text(comma(total),'42px Arial','#262626')
        totalV.textAlign='right';
        totalV.x        =   textWidth;

        var line        =   new Shape();
        line.graphics.ss(2).s('#e6e6e6').moveTo(0,0).lineTo(textWidth,0).es();
        line.y = 80;

        var vDot1       =   new Shape();
        vDot1.graphics.f(vColor1).arc(10, 0, 10, 0, 360, false);
        vDot1.y         =  140;

        var vText1      =   new Text('�����ݾ�','42px sdsGnsb','#262626');
        vText1.x        =   30;
        vText1.y        =   120;
        var vTextPer1      =   new Text('('+a1.toFixed(1)+'%)','42px Arial','#666666');
        vTextPer1.x        =   200;
        vTextPer1.y        =   120;
        var vDot1       =   new Shape();
        vDot1.graphics.f(vColor1).arc(10, 0, 10, 0, 360, false);
        vDot1.y         =   140;
        var vTextValue1 =   new Text(comma(v1),'38px Arial','#262626');
        vTextValue1.textAlign   =   'right';
        vTextValue1.x   =   textWidth
        vTextValue1.y   =   120;

        var vDot2       =   new Shape();
        vDot2.graphics.f(vColor2).arc(10, 0, 10, 0, 360, false);
        vDot2.y         =  220;
        var vTextValue2 =   new Text(comma(v2),'42px Arial','#262626');
        vTextValue2.textAlign   =   'right';
        vTextValue2.x   =   textWidth
        vTextValue2.y   =   200;

        var vText2      =   new Text('�غ��ڻ�','42px sdsGnsb','#262626');
        vText2.x        =   30;
        vText2.y        =   200;
        var vTextPer2      =   new Text('('+a2.toFixed(1)+'%)','38px Arial','#666666');
        vTextPer2.x        =   200;
        vTextPer2.y        =   200;

        $.each([vTextPer2,vDot2,vText2,vTextPer1,vDot1,vText1,totalV,line,totalT,vTextValue1,vTextValue2 ],function(idx,value){
            //console.log(  value )
            textCont.addChild(value);
        });

        textCont.x = 450;
        content.addChild(textCont);

        drawCircle({
            canvas      :   canvas,
            stage       :   stage,
            content     :   content,
            x           :   185,
            y           :   185,
            radius      :   185,
            circle      :   95,
            stroke      :   3,
            array       :   [
                {
                    value   :   a1,
                    color   :   vColor1,
                    img     :   null
                },{
                    value   :   a2,
                    color   :   vColor2,
                    img     :   null
                }
            ]
        });
        //simulation1
    }

    commonJs.graph.simulation2 = function( type , arr )
    {
        var array1      =   ['�ֽ���','ä��/������','��ü����','ELS/DLS','WRAP','��Ź','���ݿ���'];
        var array2      =   ['�ֽ�','ä��','�ݵ�','ELS/DLS','WRAP','��Ź','���ݿ���'];

        var option      =   {
            canvas      :   "#simulation2",
            circleX     :   250,
            circleY     :   250,
            outWidth    :   250,
            inWidth     :   125,
            value       :   arr,
            title       :   (type=='type1')?array1:array2,
            color       :   ['#5f82d2','#314689','#1598dc','#ff8e2b','#887be4','#5bd6a0','#ee74b3'],
            titleX:560,                                                 // ����X��ǥ
            titleY:30,
            perV:false,
            valueV:false,
            info:true
        }
        commonJs.graph.drawPieChart(option);
    }

    commonJs.graph.hanaGtaa = function(opt)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =    new Container();
        var Text        =   ctjs.Text;

        canvas          =   $('#hanaGtaa');
        stage           =   new createjs.Stage(canvas.get(0));

        var startX      =   84;
        var startY      =   330;
        var color       =   '#3698d9';
        var min         =   opt.min;
        var max         =   opt.max;
        var graphH      =   255;
        var graphW      =   890;
        var arr         =   opt.value;
        var p           =   graphW/(arr.length-1);
        var lineW       =   3;

        var xTxt        =   new Container();
        //xTxt.x = 185;
        xTxt.y = 350;

        var yTxt        =   new Container();
        yTxt.x = 70;
        yTxt.y = 325;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr     :   opt.yArr,
            textType    :   '16px Arial',
            textColor   :   '#666666',
            graphH      :   305
        });

        var graph       =   new Container();

        var dot1         =   new Shape();
        dot1.graphics.ss(lineW).s(color).f('white').dr(-5,-5,10,10);
        var dotArr1      =   [];
        for( var i =0; i<8; i++)
        {

            var tdot    =   new Shape();
            tdot        =   dot1.clone();
            tdot.width  =   10;
            dotArr1.push(tdot);

            tdot.visible = (i==0||i==7)?false:true;
        }
        drawLine({
            target      :   graph,
            color       :   color,
            min         :   min,
            max         :   max,
            lineW       :   lineW,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   dotArr1,
            value       :   arr,
            startX      :   startX,
            startY      :   startY,
            type        :   'type2'
        });

        //console.log( opt.xArr )
        var xArr = opt.xArr;
        for( var i = 0; i<xArr.length; i++)
        {
            var txt    =   new Text(xArr[i],'16px Arial','#666666');
            txt.x      =   100+((i)*(908/xArr.length));
            //console.log('xxx')
            xTxt.addChild(txt);
        }

        var mask = new Shape();
        mask.graphics.f('black').dr(0,0,0,415);
        mask.width=1000;
        mask.height=600;

        content.addChild(yTxt);
        content.addChild(xTxt);
        stage.addChild(content);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        if( !lowMode() ){
            rectMaskAnimation(graph,mask);
            graph.addEventListener('complete',function()
            {
                 createjs.Ticker.removeEventListener('tick',tick);
            });

            var tick = function(){
                stage.update();
            }
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener('tick',tick);
        }

        content.addChild(graph);
        stage.update();
    }

    commonJs.graph.mfolioRate = function(opt)
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =    new Container();
        var Text        =   ctjs.Text;

        canvas          =   $('#mfolioRate');
        stage           =   new createjs.Stage(canvas.get(0));

        var startX      =   110;
        var startY      =   560;
        var color       =   '#3698d9';
        var min         =   opt.min;
        var max         =   opt.max;
        var graphH      =   492;
        var graphW      =   850;
        var arr         =   opt.value;
        var p           =   graphW/(arr.length-1);

        var xTxt        =   new Container();
        //xTxt.x = 185;
        xTxt.y = 592;

        var yTxt        =   new Container();
        yTxt.x = 90;
        yTxt.y = 545;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr     :   opt.yArr,
            textType    :   '32px Arial',
            textColor   :   '#666666',
            graphH      :   575
        });

        var graph       =   new Container();

        drawLine({
            target      :   graph,
            color       :   color,
            min         :   min,
            max         :   max,
            lineW       :   4,
            graphW      :   graphW,
            graphH      :   graphH,
            dot         :   null,
            value       :   arr,
            startX      :   startX,
            startY      :   startY,
            type        :   'type1'
        });

        //console.log( opt.xArr )
        var xArr = opt.xArr;
        for( var i = 0; i<xArr.length; i++)
        {
            var txt    =   new Text(xArr[i],'32px Arial','#666666');
            txt.x      =   startX+((i)*(1008/xArr.length));
            xTxt.addChild(txt);
        }

        var dot1        =   new Shape();
        var dot2        =   new Shape();

        dot1.graphics.ss(4).s(color).f('white').arc(0, 0, 8, 0, 360, false);
        dot1.x = startX;
        dot1.y = startY-chValue(arr[0]-min,max-min,graphH);

        dot2   = dot1.clone();
        dot2.x = startX + (p * (arr.length-1));
        dot2.y = startY-chValue(arr[arr.length-1]-min,max-min,graphH);

        //txt2.x  =   dot2.x;

        var mask = new Shape();
        mask.graphics.f('black').dr(0,0,0,415);
        mask.width=1000;
        mask.height=600;
        graph.addChild(dot1);
        graph.addChild(dot2);

        content.addChild(yTxt);
        content.addChild(xTxt);
        stage.addChild(content);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        if( !lowMode() ){
            rectMaskAnimation(graph,mask);
            graph.addEventListener('complete',function()
            {
                 createjs.Ticker.removeEventListener('tick',tick);
            });

            var tick = function(){
                stage.update();
            }
            createjs.Ticker.setFPS(24);
            createjs.Ticker.addEventListener('tick',tick);
        }

        content.addChild(graph);
        stage.update();
    }

    //am>mFolioPortfolio.html , am>mfolioRate.html
    commonJs.graph.mfolioPortfolio = function(month,arr)
    {
        var canvas;
        var stage;
        var ctjs            =   createjs;
        var Container       =   ctjs.Container;
        var Text            =   ctjs.Text;

        var option      =   {
            canvas      :   "#mfolioPortfolio",
            circleX     :   250,
            circleY     :   260,
            outWidth    :   250,
            inWidth     :   125,
            value       :   arr,
            title       :   ['�����ֽ�','�ؿܼ���','�ؿ��̸�¡','����ä��','�ؿ�ä��','������','������','��ü����'],
            color       :   ['#5f82d2','#314689','#1598dc','#ff8e2b','#887be4','#5bd6a0','#ee74b3','#fc8778'],
            titleX:560,                                                 // ����X��ǥ
            titleY:30,
            perV:true,
            valueV:false,
            info:true
        }
        var content = commonJs.graph.drawPieChart(option);

        canvas              =   $("#mfolioPortfolio");
        stage               =   new createjs.Stage(canvas.get(0));

        // ��ǥ��
        var monthT = new Container();
        var txt1 = new Text(month,'60px Arial','#262626');
        var txt2 = new Text('��','42px sdsGnsb','#262626');
        txt1.textAlign = 'right';
        if(month.length>0)
        {
            txt2.y = 14;
            monthT.addChild(txt1);
            monthT.addChild(txt2);
            monthT.x = 240;
            monthT.y = 230;
        }
        content.addChild(monthT);
        stage.update();
    }

    commonJs.graph.dc = function( v1 , v2 )
    {

        var option      =   {
            canvas      :   "#dc",
            circleX     :   300,
            circleY     :   270,
            outWidth    :   230,
            inWidth     :   95,
            value       :   arguments,
            title       :   '',
            color       :   ['#52a4e9','#887be4'],
            titleX:0,                                                 // ����X��ǥ
            titleY:0,
            perV:false,
            valueV:false,
            info:false
        }
        commonJs.graph.drawPieChart(option);
    }

    commonJs.graph.financialInvest = function(opt)
    {
        var canvas;

        /**/
        // ������Ʈ
        var x = 230;
        var y = 230;
        var LINE_WIDTH = 60;
        var CIRCLE_GRAY = '#d9d9d9';
        var CIRCLE_BLUE = '#52a4e9';
        var CIRCLE_RADIUS = 199;
        canvas = $("#financialInvest");

        var ctjs        =   createjs;
        var stage       =   new ctjs.Stage(canvas.get(0));
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var Text        =   ctjs.Text;
        var Tween       =   ctjs.Tween;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();
        var txt1        =   new Text(opt.value+'%','70px Arial','#262626')
        txt1.textAlign  =   'center';
        txt1.x = x;
        txt1.y = y-70;
        var txt2        =   new Text(opt.text,'36px sdsGnr','#666666')
        txt2.textAlign  =   'center';
        txt2.x = x;
        txt2.y = y+20;

        var b = new createjs.Shape();
        b.color = CIRCLE_GRAY;
        b.graphics.ss(LINE_WIDTH, "round", "round").s(b.color).arc(x, y, CIRCLE_RADIUS, 0, 360, false);

        var c = new createjs.Shape();
        c.color = CIRCLE_BLUE;
        c.graphics.ss(LINE_WIDTH, "round", "round").s(c.color).arc(x, y, CIRCLE_RADIUS, 0, 10, false);
        c.angle=0;
        c.thickness = LINE_WIDTH;
        //c.color = CIRCLE_BLUE;
        var sround  =   new createjs.Shape();
        sround.graphics.f('#358fda').arc(0,0,LINE_WIDTH/2,0,360,false);
        var start = 270*Math.PI/180;
        sround.x    =   (x)+(CIRCLE_RADIUS)*Math.cos(start);
        sround.y    =   (y)+(CIRCLE_RADIUS)*Math.sin(start);
        c.circle = sround;

        var tween = createjs.Tween.get(c, {loop:false}).to({angle:chValue(opt.value,100,360)}, 1000, createjs.Ease.circInOut);
        tween.addEventListener("change", handleChange);
        function handleChange(event)
        {
            var start = 270*Math.PI/180;
            var s = event.target.target;
            s.angle += 1;
            var endAngle = (s.angle) * Math.PI / 180;
            s.graphics.clear();
            s.circle.x = (x)+(CIRCLE_RADIUS)*Math.cos(endAngle+start);
            s.circle.y = (y)+(CIRCLE_RADIUS)*Math.sin(endAngle+start);
            s.graphics.ss(s.thickness, "round", "round").s(s.color).arc(x, y, CIRCLE_RADIUS, 0+start, endAngle+start, false);
        }

        graph.addChild(b);
        graph.addChild(c);
        graph.addChild(sround);
        graph.addChild(txt1);
        graph.addChild(txt2);
        content.addChild(graph);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        stage           =   new createjs.Stage(canvas.get(0));
        //stage.autoClear =   true;
        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", tick);
        function tick() { stage.update(); }
        stage.addChild(content);
        stage.update();
    }

    commonJs.graph.assetPortfolio = function(v1,v2,v3,v4)
    {
        var option      =   {
            canvas      :   "#assetPortfolio",
            circleX     :   320,
            circleY     :   340,
            outWidth    :   230,
            inWidth     :   95,
            value       :   arguments,
            title       :   ['�ֽ�','������','�����ɼ�','ä��','��Ÿ'],
            color       :   ['#887be4','#7bd9e4','#96df8d','#52a4e9'],
            titleX:680,                                                 // ����X��ǥ
            titleY:250,
            perV:false,
            valueV:false,
            info:true
        }
        commonJs.graph.drawPieChart(option);
    }

    commonJs.graph.drawPieChart = function( opt )
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        canvas          =   $(opt.canvas);
        stage           =   new createjs.Stage(canvas.get(0));

        var option      =   {
            canvas      :   canvas,
            stage       :   stage,
            content     :   content,
            x           :   opt.circleX,
            y           :   opt.circleY,
            radius      :   opt.outWidth,
            circle      :   opt.inWidth,
            stroke      :   5,
            array       :   []
        }

        for( var i = 0; i<opt.value.length; i++)
        {
            var v = opt.value[i];
            var t = opt.title[i];
            var c = opt.color[i];
            var obj = option.array[i] = {};

            obj.title = t;
            obj.value = v;
            obj.color = c;
        }

        drawCircle(option);
        var infoObj = {
            x       :   opt.titleX,
            y       :   opt.titleY,
            perV    :   opt.perV,
            valueV  :   opt.valueV,
            target  :   content
        }
        if(opt.info)
        {
            infobox(infoObj,option.array);
        }

        stage.update();

        return content;
    }

    commonJs.graph.drawPieChart2 = function( opt )
    {
        var canvas;
        var stage;
        var ctjs        =   createjs;
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        canvas          =   $(opt.canvas);
        stage           =   new createjs.Stage(canvas.get(0));

        var option      =   {
            canvas      :   canvas,
            stage       :   stage,
            content     :   content,
            x           :   opt.circleX,
            y           :   opt.circleY,
            radius      :   opt.outWidth,
            circle      :   opt.inWidth,
            stroke      :   5,
            array       :   []
        }

        for( var i = 0; i<opt.value.length; i++)
        {
            var v = opt.value[i];
            var t = opt.title[i];
            var c = opt.color[i];
            var obj = option.array[i] = {};

            obj.title = t;
            obj.value = v;
            obj.color = c;
        }

        drawCircle(option);
        var infoObj = {
            x       :   opt.titleX,
            y       :   opt.titleY,
            perV    :   opt.perV,
            valueV  :   opt.valueV,
            target  :   content
        }
        if(opt.info)
        {
            infobox2(infoObj,option.array);
        }

        stage.update();

        return content;
    }

    // my > namy100500_graph1.jsp
    commonJs.graph.wholeAssetsCircle2 = function(v1,v2,v3,v4,v5,v6,v7,v8)
    {
        // console.log(arguments);
        var option      =   {
            canvas      :   "#wholeAssetsCircle",
            circleX     :   230,
            circleY     :   290,
            outWidth    :   230,
            inWidth     :   110,
            value       :   arguments,
            title       :   ['������','�ֽ�','�ؿ��ֽ�','�����ɼ�','������ǰ','�ؿܼ���/FX����','KRX������','��Ÿ'],
            color       :   ['#9bbb59','#33b6a5','#efae3d','#8dc63f','#4e73c0','#9bbb59','#1e69c8','#babcd1'],
            titleX:530,                                                 // ����X��ǥ
            titleY:65,
            perV:true,
            valueV:false,
            info:true
        }
        commonJs.graph.drawPieChart(option);
    }

    // my > mygraph1.html
    commonJs.graph.wholeAssetsCircle = function(v1,v2,v3,v4,v5,v6,v7,v8,v9)
    {
        // console.log(arguments);
        var option      =   {
            canvas      :   "#wholeAssetsCircle",
            circleX     :   230,
            circleY     :   290,
            outWidth    :   230,
            inWidth     :   110,
            value       :   arguments,
            title       :   ['������ǰ','�ֽ�','�����ɼ�','�ؿ��ֽ�','�ſ����','�ؿܼ���/FX����','������','KRX������','��Ÿ'],
            color       :   ['#4e73c0','#33b6a5','#8dc63f','#efae3d','#f75e5e','#9bbb59','#4f6228','#1e69c8','#babcd1'],
            titleX:530,                                                 // ����X��ǥ
            titleY:65,
            perV:true,
            valueV:false,
            info:true
        }
        commonJs.graph.drawPieChart(option);
    }

    // my mygraph1.html
    //wholeAssetsBar
    commonJs.graph.wholeAssetsBar = function(arr1,arr2)
    {
        doc.find('ul.wholeAssetsBarJs>li').each(function(idx)
        {
            var li = $(this);
            var span = li.find('div.data>div.lineGraph>span');
            span.css('width','0%');
            var n = arr1[idx];
            var p = arr1[idx];
            if(n > 100) {
                n = 100;
            }
            span.stop().delay(idx*50).animate({width:n+'%'},400,'easeInOutCirc');
            var per = li.find('div.data>div.num>em:eq(0)').text(p+'%');
            var txt = li.find('div.data>div.num>em:eq(1)').text(arr2[idx]);
        });
    }

    commonJs.graph.isa = function(opt)
    {
       var canvas;
       var stage;
       var ctjs         =   createjs;
       var Container    =   ctjs.Container;
       var Bitmap       =   ctjs.Bitmap;
       var Shape        =   ctjs.Shape;
       var Text         =   ctjs.Text;
       var chValue      =   commonJs.graph.changeValue;
       var content      =   new Container();
       canvas = $("#isa");
       stage = new createjs.Stage(canvas.get(0));
       var pattern = ['../../static/images/graph/isa_pattern4.gif','../../static/images/graph/isa_pattern5.gif','../../static/images/graph/isa_pattern6.gif'];
       var bullet = [];
       bullet[0]='../../static/images/graph/isa_bullet1.gif';
       bullet[1]='../../static/images/graph/isa_bullet2.gif';
       bullet[2]='../../static/images/graph/isa_bullet3.gif';
       bullet[3]='../../static/images/graph/isa_bullet4.gif';
       bullet[4]='../../static/images/graph/isa_bullet5.gif';
       bullet[5]='../../static/images/graph/isa_bullet6.gif';

       var option = {
           canvas   :   canvas,
           stage    :   stage,
           content  :   content,
           x        :   310,
           y        :   260,
           radius   :   230,
           circle   :   95,
           stroke   :   5,
           array    :[
               {
                   value    :   0,
                   color    :   '#ff6678',
                   img      :   null,
                   bullet   :   '',
                   title    :   '�ſ��������'
               },{
                   value    :   0,
                   color    :   '#e46eef',
                   img      :   null,
                   bullet   :   '',
                   title    :   '��������'
               },{
                   value    :   0,
                   color    :   '#a082f3',
                   img      :   null,
                   bullet   :   '',
                   title    :   '�ټҳ�������'
               },{
                   value    :   0,
                   color    :   '',
                   img      :   '',
                   bullet   :   '',
                   title    :   '��������'
               },{
                   value    :   0,
                   color    :   '',
                   img      :   '',
                   bullet   :   '',
                   title    :   '��������'
               },{
                   value    :   0,
                   color    :   '',
                   img      :   '',
                   bullet   :   '',
                   title    :   '�ſ쳷������'
               }]
        };

        for( var i = 0; i<6; i++)
        {
            var v = opt.value[i];
            var t = opt.title[i];
            var obj = option.array[i];
            obj.title = t;
            obj.value = v;
        }

       var cn = 0;
       for( var i =0; i<3; i++)
       {
           var img = new Image();
           img.src = pattern[i];
           img.n = i;
           img.onload = function()
           {
               option.array[this.n+3].img = this;
               cn++;
               if( cn == 3)
               {
                   drawCircle(option);
               }
           }
       }

       var bn = 0;
       for( var j = 0; j < bullet.length; j++)
       {
           var img = new Image();
           img.src = bullet[j];
           img.n = j;
           img.onload = function()
           {
               option.array[this.n].bullet = this;
               bn++;
               if( bn == bullet.length ){
                   tileSet();
               }
           }
       }

       function tileSet()
       {
           var title = new Container();
           title.x = 620;
           title.y = 75;
           var cn = 0;

           for( var i = 0; i<bullet.length; i++)
           {
               var obj = option.array[i];
               var tm = new Container();
               //tm.addChild(new createjs.Bitmap(option.array[i].bullet));
               if( obj.value > 0 ){
                   tm.addChild(new createjs.Bitmap(obj.bullet));
                   var txt = new Text(obj.title,'42px sdsGnsb','#262626')
                   tm.y = 65*cn;
                   txt.x = 35;
                   tm.addChild(txt);
                   title.addChild(tm);
                   cn++;
                }
           }
           content.addChild(title);
           stage.update();
       }

        /*
        var array1      =   ['�ֽ���','ä��/������','��ü����','ELS/DLS','WRAP','��Ź','���ݿ���'];
        var array2      =   ['�ֽ�','ä��','�ݵ�','ELS/DLS','WRAP','��Ź','���ݿ���'];

        var option      =   {
            canvas      :   "#simulation2",
            circleX     :   250,
            circleY     :   250,
            outWidth    :   250,
            inWidth     :   125,
            value       :   arr,
            title       :   (type=='type1')?array1:array2,
            color       :   ['#5f82d2','#314689','#1598dc','#ff8e2b','#887be4','#5bd6a0','#ee74b3'],
            titleX:560,                                                 // ����X��ǥ
            titleY:30,
            perV:false,
            valueV:false,
            info:true
        }

        commonJs.graph.drawPieChart(option);
        */
   }

    // portfolio.html
    commonJs.graph.portfolio = function( arr )
    {
        var canvas;

        /**/
        // ������Ʈ
        var x = 250;
        var y = 250;
        var LINE_WIDTH = 50;
        var CIRCLE_GRAY = '#d9d9d9';
        var CIRCLE_RADIUS = 160;
        canvas = $("#portfolio");

        var ctjs = createjs;
        var stage = new ctjs.Stage(canvas.get(0));
        var Container = ctjs.Container;
        var Bitmap = ctjs.Bitmap;
        var Shape = ctjs.Shape;
        var Text = ctjs.Text;
        var Tween = ctjs.Tween;
        var content = new Container();
        var graphArr = [];
        var chValue = commonJs.graph.changeValue;

        graphArr[0] = {
            shap    :   new Container(),
            bgC     :   '#6ec0ff',
            cuC     :   '#3698d9',
            x       :   28,
            y       :   12,
            txt     :   '�����ֽ���',
            won     :   arr[0].won,
            value   :   arr[0].value
        };
        graphArr[1] = {
            shap    :   new Container(),
            bgC     :   '#52a4e9',
            cuC     :   '#358fda',
            x       :   500,
            y       :   12,
            txt     :   '�ؿ��ֽ���',
            won     :   arr[1].won,
            value   :   arr[1].value
        };
        graphArr[2] = {
            shap    :   new Container(),
            bgC     :   '#1e69c8',
            cuC     :   '#003d8a',
            x       :   28,
            y       :   510,
            txt     :   'ä����',
            won     :   arr[2].won,
            value   :   arr[2].value
        };
        graphArr[3] = {
            shap    :   new Container(),
            bgC     :   '#716cbf',
            cuC     :   '#413b9f',
            x       :   500,
            y       :   510,
            txt     :   '�������',
            won     :   arr[3].won,
            value   :   arr[3].value
        };

        var tweenArr = [];
        for( var i = 0; i<graphArr.length; i++)
        {
            var info = graphArr[i];
            var st = info.shap;

             var b = new createjs.Shape();
            b.color = CIRCLE_GRAY;
            b.graphics.ss(LINE_WIDTH, "round", "round").s(b.color).arc(x, y, CIRCLE_RADIUS, 0, 360, false);
            st.addChild(b);

            var sround = new createjs.Shape();
            sround.graphics.f(info.cuC).arc(0,0,LINE_WIDTH/2,0,360,false);

            var s = new createjs.Shape();
            var g = s.graphics;
            s.angle = 0;
            //s.radius = 100;
            s.thickness = LINE_WIDTH;
            s.color = info.bgC;
            s.circle = sround;

            // ���� 0�ϰ��� �׸��� �ȴ´�.
            if(info.value>0){
                var tween = createjs.Tween.get(s, {loop:false}).wait(i*100).to({angle:chValue(info.value,100,360)}, 1000, createjs.Ease.circInOut);
                tween.addEventListener("change", handleChange);
                st.addChild(s);
                st.addChild( sround );
                tweenArr.push(tween);
            }
            //amily:sdsGnm;src:url(../font/sdsGnm.woff) format('woff')}
            //@font-face{font-family:sdsGnsb;src:url(../font/sdsGnsb.woff) format('woff')}
            //chValue(arr[0].value,100,360)
            var txt = new Text(info.txt,'36px sdsGnsb','#666666');
            txt.x = 250;
            txt.y = 280;
            txt.textAlign='center';
            var vTxt = new Text(info.value+'%','70px Arial','#262626');
            vTxt.x = 250;
            vTxt.y = 190;
            vTxt.textAlign='center';
            var wTxt = new Text(info.won+'��','46px Arial','#262626');
            wTxt.x = 130;
            wTxt.y = 460;

            st.addChild(txt);
            st.addChild(vTxt);
            st.addChild(wTxt);

            start = 270*Math.PI/180;
            sround.x = (x)+(CIRCLE_RADIUS)*Math.cos(start);
            sround.y = (y)+(CIRCLE_RADIUS)*Math.sin(start);
        }
        function handleChange(event)
        {
            var start = 270*Math.PI/180;
            var s = event.target.target;
            s.angle += 1;
            var endAngle = (s.angle) * Math.PI / 180;
            s.graphics.clear();
            s.circle.x = (x)+(CIRCLE_RADIUS)*Math.cos(endAngle+start);
            s.circle.y = (y)+(CIRCLE_RADIUS)*Math.sin(endAngle+start);
            //
            s.graphics.ss(s.thickness, "round", "round").s(s.color).arc(x, y, CIRCLE_RADIUS, 0+start, endAngle+start, false);
        }

        function tick()
        {
            stage.update();
        }

        for( i = 0; i<graphArr.length; i++ )
        {
            var info = graphArr[i];
            var sp = info.shap;
            sp.x = info.x;
            sp.y = info.y;
            content.addChild(sp);
        }

        tweenArr[tweenArr.length-1].call(function(){
            for(var i=0; i<tweenArr.length; i++){
                tweenArr[i].removeEventListener('change',handleChange);
            }
            createjs.Ticker.removeEventListener("tick", tick);
        });

        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        stage = new createjs.Stage(canvas.get(0));
        stage.autoClear = true;
        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", tick);
        stage.addChild(content);
        stage.update();
    }

    // naam202504.html
    commonJs.graph.globalFundInfo = function( opt )
    {
        //var canvas = document.getElementById("globalFundInfo");
        var canvas = $("#globalFundInfo");
        var ctjs = createjs;
        //var stage = new ctjs.Stage(canvas);
        var stage = new ctjs.Stage(canvas.get(0));
        var Container = ctjs.Container;
        var Bitmap = ctjs.Bitmap;
        var Shape = ctjs.Shape;
        var Text = ctjs.Text;
        var Tween = ctjs.Tween;
        var content = new Container();

        //var bmp = new createjs.Bitmap("../../static/images/graph/global_fund_info_bg.png");
        var dotG = new createjs.Bitmap("../../static/images/graph/global_fund_info_dot_g.png");
        var dotR = new createjs.Bitmap("../../static/images/graph/global_fund_info_dot_r.png");
        var dotB = new createjs.Bitmap("../../static/images/graph/global_fund_info_dot_b.png");
        var bmShape = new Shape();
        var bmContain = new Container();
        var kospiShape = new Shape();
        var kospiContain = new Container();

        var yTxt = new Container();
        var xTxt = new Container();

        var startX = 200;
        var startY = 368;
        var dotW = 10;
        var maxH = 220;
        var rMin = opt.min;
        var rMax = opt.max-rMin;
        var graphW = 700;
        var gW     = graphW/(opt.bm.length-1)
        var COLOR_RED   = '#fd5758';
        var COLOR_BLUE  = '#3469bf';
        var COLOR_GRAY  = '#999999';
        var LINE_W = 5;

        bmShape.graphics.setStrokeStyle(LINE_W).beginStroke(COLOR_GRAY);
        // bm ����
        var bPoint = opt.bm;
        bmContain.addChild(bmShape);
        for( var i=0; i<bPoint.length; i++)
        {
            var dot = dotG.clone();
            dot.x = (gW*i)-dotW;
            var p = ((bPoint[i]-rMin)/rMax)*maxH;
            dot.y = (startY-(p))-dotW;
            bmShape.graphics.lineTo(gW*i,startY-(p));
            bmContain.addChild(dot);
        }
        bmShape.graphics.endStroke();

        bmContain.x = startX;
        bmContain.y = 0;

        //kospi ����
        var pPoint = opt.kospi;
        var checkColor = function( n )
        {
            var obj = {color:'', dot:''};
            var c = pPoint[n];
            var n;
            if(n==0){
               n =  pPoint[n+1];
               if(c<n){
                   obj.color = COLOR_RED;
                   obj.dot   = dotR.clone();
               }else if(c==n){
                   obj.color = COLOR_GRAY;
                   obj.dot   = dotG.clone();
               }else{
                   obj.color = COLOR_BLUE;
                   obj.dot   = dotB.clone();
               }
            }else{
               n = pPoint[n-1];
               if(c>n){
                   obj.color = COLOR_RED;
                   obj.dot = dotR.clone();
               }else if(c==n){
                   obj.color = COLOR_GRAY;
                   obj.dot   = dotG.clone();
               }else{
                   obj.color = COLOR_BLUE;
                   obj.dot = dotB.clone();
               }
            }
            return obj;
        }

        var obj = checkColor(0);
        kospiShape.graphics.setStrokeStyle(LINE_W).beginStroke(obj.color);
        var dot = obj.dot;
        dot.x = 0-dotW;
        var p = ((pPoint[0]-rMin)/rMax)*maxH;
        dot.y = (startY-(p))-dotW;

        kospiContain.addChild(kospiShape);
        kospiContain.addChild(dot);

        for( var i=1; i<pPoint.length; i++)
        {
            var obj = checkColor(i);
            var dot = obj.dot.clone();
            dot.x = (gW*i)-dotW;
            var o = ((pPoint[i-1]-rMin)/rMax)*maxH;
            var p = ((pPoint[i]-rMin)/rMax)*maxH;
            dot.y = (startY-(p))-dotW;

            kospiShape.graphics.beginStroke(obj.color);
            kospiShape.graphics.moveTo(gW*(i-1),startY-(o));
            kospiShape.graphics.lineTo(gW*i,startY-(p));
            kospiContain.addChild(dot);
        }

        kospiContain.x = startX;
        kospiContain.y = 0;

        var yArr = opt.yArr;
        for(var i =0; i<yArr.length; i++)
        {
            var m = new Text(yArr[i],'32px Arial','#666666');
            m.y = i*-32;
            m.textAlign='right'
            yTxt.addChild(m);
        }

        var xTarr = ['1M','3M','6M','1Y'];
        commonJs.graph.xTextAlign({
            target      :   xTxt,
            textArr     :   xTarr,
            textType    :   '32px Arial',
            textColor   :   '#666666',
            graphW      :   graphW,
            vArr        :   bPoint,
            startX      :   startX,
            textAlign   :   'center',
            type        :   'type1'
        });

        yTxt.x = 70;
        yTxt.y = 350;
        //xTxt.x = -50;
        xTxt.y = 380;

        var lineCont = new Container();
        lineCont.addChild(bmContain);
        lineCont.addChild(kospiContain);
        content.addChild(xTxt);
        content.addChild(yTxt);

        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage });
        if( !lowMode() ){
            var mask = new Shape();
            mask.graphics.f('black').dr(100,100,100,444);
            mask.width  =   1008;
            mask.height =   380;
            rectMaskAnimation(lineCont,mask);
            createjs.Ticker.setFPS(24);
            var tick = function(){
                stage.update();
            };
            createjs.Ticker.addEventListener('tick',tick);
            lineCont.addEventListener('complete',function(){
                createjs.Ticker.removeEventListener('tick',tick);
            });
        }else{
            setTimeout(function(){
                stage.update();
            },100)
        }
        content.addChild(lineCont);
        stage.addChild(content);
        stage.update();
    }

    // am>naam202505
    commonJs.graph.assetTypeSetup = function( opt )
    {
        var canvas = $("#assetType");
        var ctjs = createjs;
        var stage = new ctjs.Stage(canvas.get(0));
        var Container = ctjs.Container;
        var Bitmap = ctjs.Bitmap;
        var Shape = ctjs.Shape;
        var Text = ctjs.Text;
        var Tween = ctjs.Tween;
        var content = new Container();

        var yTxt = new Container();
        var xTxt = new Container();
        var valueArr = [opt.value1,opt.value2,opt.value3,opt.value4,opt.value5,opt.value6,opt.value7];

        var dotW = 10;
        var maxH = 220;
        var rMin = opt.min;
        var rMax = opt.max-rMin;

        var yArr = opt.yArr;
        var startX = 100;
        var startY = 487;
        var partionH =62;
        var graphW = 877;
        var graphH = 437;
        var COLOR_RED       = '#ff798a';
        var COLOR_GREEN     = '#6ac19b';
        var COLOR_YELLOW    = '#ffc279';
        var LINE_W = 2;
        var centerN = 0;
        var center = 0;
        //
        var value = [];

        var choiceArr   = opt.choice;

        for( var i = 0; i<7; i++)
        {
            value.push({
                line : new Shape(), up : new Shape(), down : new Shape()
            });
        }

        for( var i =0; i<yArr.length; i++)
        {
            if( yArr[i] == 0 ){
               centerN = i;
            }
        }
        center = (centerN*partionH);

        var ch = opt.max -  opt.min;
        for( var i =0; i<value.length; i++)
        {
            var arr = valueArr[i];
            var obj = value[i];
            var line = obj.line;
            //line.graphics.s('black').ss(LINE_W).moveTo(0,startY - ((arr[0]-opt.min)/ch)*graphH );
            var up = obj.up;
            up.graphics.f('black').moveTo(0,startY - ((arr[0]-opt.min)/ch)*graphH );
            var down = obj.down;
            down.graphics.f('blue').moveTo(0,startY - ((arr[0]-opt.min)/ch)*graphH );

            var down = obj.down;

            for( var j=0; j<arr.length; j++)
            {
                up.graphics.lineTo( (j*(graphW/(arr.length-1))) , startY - ((arr[j]-opt.min)/ch)*graphH  );
                //line.graphics.lineTo( (j*(graphW/(arr.length-1) ) ) , startY - ((arr[j]-opt.min)/ch)*graphH  );
                down.graphics.lineTo( (j*(graphW/(arr.length-1))) , startY - ((arr[j]-opt.min)/ch)*graphH  );
            }
            up.graphics
            .lineTo( ((j-1)*(graphW/(arr.length-1))) ,  startY-graphH )
            .lineTo(0,startY-graphH)
            .lineTo(0,startY - ((arr[0]-opt.min)/ch)*graphH)
            .es();

            down.graphics
            .lineTo( graphW ,  startY-graphH )
            .lineTo( graphW , startY)
            .lineTo( 0 , startY)
            .lineTo( 0 , startY - ((arr[0]-opt.min)/ch)*graphH)
            .es();
        }

        // ����ũ �� ����
        var red_up      = new Shape();
        var red_down    = new Shape();
        red_down.graphics.f(COLOR_RED).dr(0,startY-center,1008,center);
        red_down.alpha = .4;

        red_up.graphics.f(COLOR_RED).dr(0,startY-center,1008,-(graphH-center) );
        red_up.alpha = .4;

        var green_up    = new Shape();
        var green_down  = new Shape();

        green_up.graphics.f(COLOR_GREEN).dr(0,startY-center,1008,-(graphH-center) );
        green_up.alpha = .4

        green_down.graphics.f(COLOR_GREEN).dr(0,startY-center,1008,center);
        green_down.alpha = .4;

        var yellow_up    = new Shape();
        var yellow_down  = new Shape();

        yellow_up.graphics.f(COLOR_YELLOW).dr(0,startY-center,1008,-(graphH-center) );
        yellow_up.alpha = .4

        yellow_down.graphics.f(COLOR_YELLOW).dr(0,startY-center,1008,center);
        yellow_down.alpha = .4;

        var mask = {
            chk1 : {
                up:red_up , down:red_down
            },
            chk3 : {
                up:green_up , down:green_down
            },
            chk2 : {
                up:yellow_up , down:yellow_down
            }
        }

        red_up.visible = false;
        red_down.visible = false;
        //red_full.visible = false;
        green_up.visible = false;
        green_down.visible = false;
       // green_full.visible = false;
        yellow_up.visible = false;
        yellow_down.visible = false;
        //yellow_full.visible = false;

        content.addChild(red_up);
        content.addChild(red_down);
        //content.addChild(red_full);
        content.addChild(green_up);
        content.addChild(green_down);
        //content.addChild(green_full);
        content.addChild(yellow_up);
        content.addChild(yellow_down);
        //content.addChild(yellow_full);

        commonJs.graph.xTextAlign({
            target      :    xTxt,
            textArr      :   opt.xArr,
            textType     :   '32px Arial',
            textColor    :   '#666666',
            vArr        :   valueArr[0],
            startX      :   startX,
            graphW      :   880,
            type        :   'type1'
        });
        xTxt.y = 500;

        commonJs.graph.yTextAlign(
        {
            target      :   yTxt,
            textArr      :   opt.yArr,
            textType     :   '32px Arial',
            textColor    :   '#666666',
            graphH      :   490
        })
        yTxt.y = 465; yTxt.x = 80;

        content.addChild(xTxt);
        content.addChild(yTxt);

        for(var i =0; i<value.length; i++)
        {
            var obj = value[i];
            obj.line.x=startX;
            obj.up.x=startX;
            obj.down.x=startX;
            content.addChild( obj.line );
            content.addChild( obj.up );
            content.addChild( obj.down );
            obj.line.visible = false;
            obj.up.visible = false;
            obj.down.visible = false;
        }

        function lineShow( idx , str)
        {
            var v =  value[idx];
            /** �ȵ���̵� ���ػ󵵹� ���ɿ� ������ �ִ� �� ���Ƽ� ���͸� ��� �׷������� ���� **/
            var c;
            v.line.visible = true;
            //v.line.graphics.clear();

            var ch = opt.max -  opt.min;
            var arr = valueArr[idx];
            switch(str)
            {
                case 'chk1':
                    c = COLOR_RED;
                break
                case 'chk2':
                    c = COLOR_YELLOW;
                break
                case 'chk3':
                    c = COLOR_GREEN;
                break
            }

            v.line.graphics.s(c).ss(4).moveTo(0,startY - ((arr[0]-opt.min)/ch)*graphH );
            for( var j=0; j<arr.length; j++)
            {
                v.line.graphics.lineTo( (j*(graphW/(arr.length-1) ) ) , startY - ((arr[j]-opt.min)/ch)*graphH  );
            }

            var m = mask[str];

            if( !lowMode() )
            {
                m.up.visible = true;
                m.up.mask = v.down;

                m.down.visible = true;
                m.down.mask = v.up;
            }else{
            }
            stage.update();
        }

        function lineHide( idx , str)
        {
            var v =  value[idx];
            v.line.visible = false;
            if( !lowMode() )
            {
                var m = mask[str];
                m.up.visible = false;
                m.down.visible = false;
            }else{
            }
            stage.update();
        }

        stage.addChild(content);

        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })
        stage.update();

        doc.find('div.assetTypeChartJs').each(function()
        {
            var chartBox = $(this);
            var idx = 0;

            $('body').off();
            var checkList = chartBox.find('li>div>input:checkbox');
            var classArr = ['chk1','chk2','chk3'];

            checkList.each(function()
            {
                var _this = $(this);
                _this.prop('checked',false);
                _this.attr('checked',false);
                var form = _this.closest('div.form');
                form.removeClass('checked');
                form.removeClass('chk1');
                form.removeClass('chk2');
                form.removeClass('chk3');

                _this.off().on('change',function(evt)
                {
                    var _this = $(this);
                    var li = _this.closest('li');
                    var n = chartBox.find('li>div>input:checkbox:checked').length;

                    var formDiv = _this.closest('div');
                    if( _this.is(':checked'))
                    {
                        if(n>3){
                            alert('�ִ� 3���� ������ �� �ֽ��ϴ�.');
                            //commonJs.layerShow('.message')

                            formDiv.removeAttr('class');
                            formDiv.addClass('form');
                            _this.attr('checked',false);
                            _this.prop('checked',false);
                            evt.preventDefault();
                        }else{
                            var str = classArr.shift();
                            lineShow(li.index(),str);

                            formDiv.addClass(str);
                            formDiv.addClass('checked');
                            _this.attr('checked',true);
                            _this.prop('checked',true);
                        }
                    }else{
                        formDiv.removeClass('checked');
                        formDiv.removeClass('form');
                        var str = formDiv.attr('class');

                        lineHide(li.index(),str);

                        classArr.unshift(str);
                        formDiv.removeClass(str);
                        formDiv.addClass('form');
                        _this.attr('checked',false);
                        _this.prop('checked',false);
                    }
                });
            });
        });

        if(choiceArr)
        {
            for(var i = 0; i<choiceArr.length; i++)
            {
                $('input:checkbox:eq('+choiceArr[i]+')').click();
            }
        }
    }

    // ���������
    function formReoad()
    {
        // �Ⱓ��ư Ŭ���� �˾�â ����
        doc.find('div.termBox').on('click','a.termBtnJs',function()
        {
            var select = $('div.termSelect');
            if($(select).css('display') == 'block') {
                select.hide();
            } else {
                select.show();
            }
        });
    }

    //my>mygraph3.html
    commonJs.myListInvestGraph = function(opt)
    {
        //console.log('-myListInvestGraph-');
        var month   =   opt.month;
        var uMax    =   opt.upMax;
        var dMax    =   opt.downMax;
        var value   =   opt.value;
        var hMax    =   ($('div.myGraph3>div.graph').height()/2)-15;


        var graph = $('div.myGraph3>div.graph>ul>li')
        graph.children('strong.grpType').each(function(idx)
        {
            $(this).text(month[idx]);
        });
        graph.children('span.grpBar').each(function(idx)
        {
            var bar = $(this);
            bar.removeClass('plus');
            bar.removeClass('minus');
            var p = value[idx];
            bar.stop().css('height','0px');

            if(p>0)
            {
                bar.animate({'height': ((p/uMax)*hMax) +'px' },400,'easeInOutCirc');
                bar.addClass('plus');
            }
            else
            {
                bar.animate({'height': ((Math.abs(p)/dMax)*hMax) +'px' },400,'easeInOutCirc');
                bar.addClass('minus');
            }
            bar.children('em').text( comma(Math.abs(p)) );
        });
    }

    // am>naam201005.html
    commonJs.slideBarGraph = function(cn)
    {
        var slider = $('.slideBarJs');
        var sw = slider.width();
        var pointer = slider.find('.pointer');
        var pw = pointer.width();
        //pointer.css('margin-left',((cn/100)*sw)-(pw)+'px' );
        pointer.css('margin-left',sw/2+'px' );
        //pointer.css('margin-left',0-(pw)+'px' );
        pointer.animate({'margin-left': ((cn/100)*(sw-pw))+'px' },400,'easeInOutCirc');
    }

    // am>mFolioGraph.html
    commonJs.mFolioGraph = function(opt)
    {
        var min = opt.min;
        var max = opt.max;
        var gh = $('div.mFolioGraph').find('.graph').height();
        var arr = opt.value;
        var arr2;
        if( opt.value2 ){
            arr2 = opt.value2;
            var li = $('div.mFolioGraph>div.graph>ul>li>span.grp1');
            for( var i=0; i<li.length; i++)
            {
                var tm = li.eq(i);
                tm.stop().css('height','0px');
                tm.animate({'height':((arr[i]-min)/(max-min))*gh +'px' },400,'easeInOutCirc')
            }
            var li2 = $('div.mFolioGraph>div.graph>ul>li>span.grp2');
            for( var i=0; i<li2.length; i++)
            {
                var tm = li2.eq(i);
                tm.stop().css('height','0px');
                tm.animate({'height':((arr2[i]-min)/(max-min))*gh +'px' },400,'easeInOutCirc')
            }
        }else{
            var li = $('div.mFolioGraph>div.graph>ul>li>span.grpBar');
            for( var i=0; i<li.length; i++)
            {
                var tm = li.eq(i);
                tm.stop().css('height','0px');
                tm.animate({'height':((arr[i]-min)/(max-min))*gh +'px' },400,'easeInOutCirc')
            }
        }
    }

    //am>naam208502_graph.html
    commonJs.holdingPeriod = function(opt)
    {
        var min = opt.min;
        var max = opt.max;
        var arr1 = opt.value1;
        var arr2 = opt.value2;
        var arr3 = opt.value3;

        var li1 = $('div.termGraph').find('span.grp1');
        var li2 = $('div.termGraph').find('span.grp2');
        var li3 = $('div.termGraph').find('span.grp3');
        var h = $('.mFolioGraph>.graph').height();

        for( var i=0; i<arr1.length; i++)
        {
            var tm1 = li1.eq(i);
            tm1.stop().css('height','');
            tm1.animate({'height':((arr1[i]-min)/(max-min))*h +'px' },400,'easeInOutCirc');

            var tm2 = li2.eq(i);
            tm2.stop().css('height','');
            tm2.animate({'height':((arr2[i]-min)/(max-min))*h +'px' },400,'easeInOutCirc');

            var tm3 = li3.eq(i);
            tm3.stop().css('height','');
            tm3.animate({'height':((arr3[i]-min)/(max-min))*h +'px' },400,'easeInOutCirc');
        }
    };

    // am>caregraph.html
    commonJs.careGraph = function(opt)
    {
        var min = opt.min;
        var max = opt.max;
        var arr = opt.value;

        var li = $('div.careGraph>div.graph').find('span.grpBar');
        for( var i=0; i<arr.length; i++)
        {
            var tm = li.eq(i);
            tm.stop().css('height',0);
            tm.animate({'height':((arr[i]-min)/(max-min))*100 +'%' },400,'easeInOutCirc')
            tm.children('em').text(arr[i]+'%');
        }
    }

    // pe>myfgraph.html
    commonJs.mySavingGraph = function(opt)
    {
        var month   =   opt.month;
        var uMax    =   opt.upMax;
        var dMax    =   opt.downMax;
        var value   =   opt.value;
        var hMax    =   ($('div.myfGraph>div.graph').height()/2)-15;

        var graph = $('div.myfGraph>div.graph>ul>li')
        graph.children('strong.grpType').each(function(idx)
        {
            $(this).text(month[idx]);
        });
        graph.children('span.grpBar').each(function(idx)
        {
            var bar = $(this);
            bar.removeClass('plus');
            bar.removeClass('minus');
            var p = value[idx];
            bar.stop().css('height','0px');

            if(p>0)
            {
                bar.animate({'height': ((p/uMax)*hMax) +'px' },400,'easeInOutCirc');
                bar.addClass('plus');
            }
            else
            {
                bar.animate({'height': ((Math.abs(p)/dMax)*hMax) +'px' },400,'easeInOutCirc');
                bar.addClass('minus');
            }
            bar.children('em').text( comma(Math.abs(p)) );
        });
    }

    // sp>scatchgraph1.html
    commonJs.investChangeGraph = function( idx , value , max)
    {
        var tm = $('div.investGraph1>div.graph>ul>li:eq('+idx+')>span.grpBar')
        tm.css('height','0%');
        tm.animate({height:(value/max)*100 +'%'},600,'easeInOutCirc');

        tm.children('em').text(value);
    }

    // sp>scatchgraph2.html
    commonJs.investDistributeGraph = function( idx , value , max)
    {
        var tm = $('div.investGraph2>div.graph>ul>li:eq('+idx+')>div>span.grpBar')
        tm.css('width','0%');
        tm.animate({width:(value/max)*100 +'%'},600,'easeInOutCirc');
        tm.children('em').text(value);
    }

    // am>fundgraph.html

    commonJs.fundGraph = function( idx , per)
    {
        var tm = $('.myStock>li:eq('+idx+')>div.data>div.lineGraph')
        tm.css('width','0%');
        tm.animate({width:per+'%'},600,'easeInOutCirc');
        //var txt = tm.next().text(per+'%');
    }

    //  ���ܼ��� ��Ʈ
    commonJs.surveyResult = function( opt )
    {
        var box = $('div.graphBox');
        var choice = opt.choice;
        var o = opt.o;
        var x = opt.x;
        var total = o+x;
        var w = box.width()-100;

        box.find('div.graph>span').stop().css('width',w/2+'px');
        box.find('div.graph>span.no').animate({'width':((x/total)*w)+23+'px'},400,'easeInOutCirc')
        box.find('div.graph>span.yes').animate({'width':((o/total)*w)+23+'px'},400,'easeInOutCirc')

        var no = box.find('dl.no>dd');
        var n = 0;
        var y = 0;
        if(total > 0) {
            n = Math.floor((x/total)*100);
            y = Math.floor((o/total)*100);
        }
        no.find('span.num>em').text( (n<y)?100-y:n );
        no.find('span.total').text('('+x+'��)');

        var yes = box.find('dl.yes>dd');

        yes.find('span.num>em').text( (n>y)?100-n:y );
        yes.find('span.total').text('('+o+'��)');
    }

    // ����м�
    commonJs.graph.basicCircle = function(opt)
    {
        console.log('a');
        var canvas;

        /**/
        // ������Ʈ
        var x = 120;
        var y = 120;
        var LINE_WIDTH = 21;
        var CIRCLE_GRAY = '#d9d9d9';  //����
        var CIRCLE_BLUE1 = '#53a2da';  //0~40�̸�
        var CIRCLE_GRAY1 = '#777';  //40~60�̸�
        var CIRCLE_RED1 = '#ff3330';  //60~100
        var CIRCLE_RADIUS = 108;
        canvas = $("#basicCircle");

        var ctjs        =   createjs;
        var stage       =   new ctjs.Stage(canvas.get(0));
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var Text        =   ctjs.Text;
        var Tween       =   ctjs.Tween;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();
        var txt1        =   new Text(opt.value+'','bold 60px sdsGnsb','#262626')
        txt1.textAlign  =   'center';
        txt1.x = x;
        txt1.y = y-26;

        var color = CIRCLE_BLUE1;
        if(opt.colorGbn=='1'){
            if(opt.value>=60){
                color = CIRCLE_RED1;
            }else if(opt.value>=40){
                color = CIRCLE_GRAY1;
            }
        }

        var b = new createjs.Shape();
        b.color = CIRCLE_GRAY;
        b.graphics.ss(LINE_WIDTH, "round", "round").s(b.color).arc(x, y, CIRCLE_RADIUS, 0, 360, false);

        var c = new createjs.Shape();
        c.color = color;
        c.graphics.ss(LINE_WIDTH, "round", "round").s(c.color).arc(x, y, CIRCLE_RADIUS, 0, 10, false);
        c.angle=0;
        c.thickness = LINE_WIDTH;
        //c.color = CIRCLE_BLUE;
        var sround  =   new createjs.Shape();
        sround.graphics.f(color).arc(0,0,LINE_WIDTH/2,0,360,false);
        var start = 270*Math.PI/180;
        sround.x    =   (x)+(CIRCLE_RADIUS)*Math.cos(start);
        sround.y    =   (y)+(CIRCLE_RADIUS)*Math.sin(start);
        c.circle = sround;

        var tween = createjs.Tween.get(c, {loop:false}).to({angle:chValue(opt.value,100,360)}, 1000, createjs.Ease.circInOut);
        tween.addEventListener("change", handleChange);
        function handleChange(event)
        {
            var start = 270*Math.PI/180;
            var s = event.target.target;
            s.angle += 1;
            var endAngle = (s.angle) * Math.PI / 180;
            s.graphics.clear();
            s.circle.x = (x)+(CIRCLE_RADIUS)*Math.cos(endAngle+start);
            s.circle.y = (y)+(CIRCLE_RADIUS)*Math.sin(endAngle+start);
            s.graphics.ss(s.thickness, "round", "round").s(s.color).arc(x, y, CIRCLE_RADIUS, 0+start, endAngle+start, false);
        }

        graph.addChild(b);
        graph.addChild(c);
        graph.addChild(sround);
        graph.addChild(txt1);
        content.addChild(graph);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        stage           =   new createjs.Stage(canvas.get(0));
        //stage.autoClear =   true;
        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", tick);
        function tick() { stage.update(); }
        stage.addChild(content);
        stage.update();
        console.log('a-1');
    }
    commonJs.graph.basicCircle2 = function(opt)
    {
        console.log('b');
        var canvas;

        /**/
        // ������Ʈ
        var x = 105;
        var y = 105;
        var LINE_WIDTH = 22;
        var CIRCLE_GRAY = '#fff';
        var CIRCLE_BLUE = '#cfe3f4';
        var CIRCLE_RADIUS = 80;
        canvas = $("#basicCircle2");


        var ctjs        =   createjs;
        var stage       =   new ctjs.Stage(canvas.get(0));
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var Text        =   ctjs.Text;
        var Tween       =   ctjs.Tween;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();
        var txt1        =   new Text(opt.value+'','bold 60px sdsGnsb','#262626')
        txt1.textAlign  =   'center';
        txt1.x = x;
        txt1.y = y-26;
        console.log('c');
       // var graphArr = [];
        //var chValue = commonJs.graph.changeValue;

        var b = new createjs.Shape();
        b.color = CIRCLE_GRAY;
        b.graphics.ss(LINE_WIDTH, "round", "round").s(b.color).arc(x, y, CIRCLE_RADIUS, 0, 360, false);

        var c = new createjs.Shape();
        c.color = CIRCLE_BLUE;
        c.graphics.ss(LINE_WIDTH, "round", "round").s(c.color).arc(x, y, CIRCLE_RADIUS, -90*(Math.PI/180), 0*(Math.PI/180), false);
        c.angle=0;
        c.thickness = LINE_WIDTH;
        //c.color = CIRCLE_BLUE;
        var sround  =   new createjs.Shape();
        sround.graphics.f('#cfe3f4').arc(0,0,LINE_WIDTH/2,0,360,false);
        var start = 270*Math.PI/180;
        sround.x    =   (x)+(CIRCLE_RADIUS)*Math.cos(start);
        sround.y    =   (y)+(CIRCLE_RADIUS)*Math.sin(start);
        c.circle = sround;

        // var tween = createjs.Tween.get(c, {loop:false}).to({angle:chValue(opt.value,100,360)}, 1000, createjs.Ease.circInOut);
        // tween.addEventListener("change", handleChange);
        // function handleChange(event)
        // {
        //     var start = 270*Math.PI/180;
        //     var s = event.target.target;
        //     s.angle += 1;
        //     var endAngle = (s.angle) * Math.PI / 180;
        //     s.graphics.clear();
        //     s.circle.x = (x)+(CIRCLE_RADIUS)*Math.cos(endAngle+start);
        //     s.circle.y = (y)+(CIRCLE_RADIUS)*Math.sin(endAngle+start);
        //     s.graphics.ss(s.thickness, "round", "round").s(s.color).arc(x, y, CIRCLE_RADIUS, 0+start, endAngle+start, false);
        // }

        graph.addChild(b);
        graph.addChild(c);
        graph.addChild(sround);
        //graph.addChild(txt1);
        content.addChild(graph);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        stage           =   new createjs.Stage(canvas.get(0));
        //stage.autoClear =   true;
        // createjs.Ticker.setFPS(24);
        // createjs.Ticker.addEventListener("tick", tick);
        // function tick() { stage.update(); }
        stage.addChild(content);
        stage.update();
        console.log(stage);
    }
    commonJs.graph.basicCircle3 = function(opt)
    {
        var canvas;

        /**/
        // ������Ʈ
        var x = 120;
        var y = 120;
        var LINE_WIDTH = 21;
        var CIRCLE_GRAY = '#d9d9d9';
        var CIRCLE_BLUE = '#3cb6b7';
        var CIRCLE_RADIUS = 108;
        canvas = $("#basicCircle3");

        var ctjs        =   createjs;
        var stage       =   new ctjs.Stage(canvas.get(0));
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var Text        =   ctjs.Text;
        var Tween       =   ctjs.Tween;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();

       // var graphArr = [];
        //var chValue = commonJs.graph.changeValue;

        var b = new createjs.Shape();
        b.color = CIRCLE_GRAY;
        b.graphics.ss(LINE_WIDTH, "round", "round").s(b.color).arc(x, y, CIRCLE_RADIUS, 0, 360, false);

        var c = new createjs.Shape();
        c.color = CIRCLE_BLUE;
        c.graphics.ss(LINE_WIDTH, "round", "round").s(c.color).arc(x, y, CIRCLE_RADIUS, 0, 10, false);
        c.angle=0;
        c.thickness = LINE_WIDTH;
        //c.color = CIRCLE_BLUE;
        var sround  =   new createjs.Shape();
        sround.graphics.f('#3cb6b7').arc(0,0,LINE_WIDTH/2,0,360,false);
        var start = 270*Math.PI/180;
        sround.x    =   (x)+(CIRCLE_RADIUS)*Math.cos(start);
        sround.y    =   (y)+(CIRCLE_RADIUS)*Math.sin(start);
        c.circle = sround;

        var tween = createjs.Tween.get(c, {loop:false}).to({angle:chValue(opt.value,100,360)}, 1000, createjs.Ease.circInOut);
        tween.addEventListener("change", handleChange);
        function handleChange(event)
        {
            var start = 270*Math.PI/180;
            var s = event.target.target;
            s.angle += 1;
            var endAngle = (s.angle) * Math.PI / 180;
            s.graphics.clear();
            s.circle.x = (x)+(CIRCLE_RADIUS)*Math.cos(endAngle+start);
            s.circle.y = (y)+(CIRCLE_RADIUS)*Math.sin(endAngle+start);
            s.graphics.ss(s.thickness, "round", "round").s(s.color).arc(x, y, CIRCLE_RADIUS, 0+start, endAngle+start, false);
        }

        graph.addChild(b);
        graph.addChild(c);
        graph.addChild(sround);
        content.addChild(graph);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        stage           =   new createjs.Stage(canvas.get(0));
        //stage.autoClear =   true;
        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", tick);
        function tick() { stage.update(); }
        stage.addChild(content);
        stage.update();
    }

    commonJs.graph.lineRound = function(opt)
    {
        var canvas;

        /**/
        // ������Ʈ
        var x = 98;
        var y = 98;
        var LINE_WIDTH = 28;
        var CIRCLE_GRAY = '#f2f2f2';
        var CIRCLE_BLUE = '#69cfc5';
        var CIRCLE_RADIUS = 80;
        canvas = $("#lineRound");

        var ctjs        =   createjs;
        var stage       =   new ctjs.Stage(canvas.get(0));
        var Container   =   ctjs.Container;
        var Bitmap      =   ctjs.Bitmap;
        var Shape       =   ctjs.Shape;
        var Text        =   ctjs.Text;
        var Tween       =   ctjs.Tween;
        var chValue     =   commonJs.graph.changeValue;
        var content     =   new Container();
        var graph       =   new Container();
        var txt1        =   new Text(opt.value+'%','bold 40px sdsGnsb','#69cfc5')
        txt1.textAlign  =   'center';
        txt1.x = x;
        txt1.y = y-20;

        var b = new createjs.Shape();
        b.color = CIRCLE_GRAY;
        b.graphics.ss(LINE_WIDTH, "round", "round").s(b.color).arc(x, y, CIRCLE_RADIUS, 0, 360, false);

        var c = new createjs.Shape();
        c.color = CIRCLE_BLUE;
        c.graphics.ss(LINE_WIDTH, "round", "round").s(c.color).arc(x, y, CIRCLE_RADIUS, 0, 10, false);
        c.angle=0;
        c.thickness = LINE_WIDTH;
        //c.color = CIRCLE_BLUE;
        var sround  =   new createjs.Shape();
        sround.graphics.f('#69cfc5').arc(0,0,LINE_WIDTH/2,0,0,false);
        var start = 270*Math.PI/180;
        sround.x    =   (x)+(CIRCLE_RADIUS)*Math.cos(start);
        sround.y    =   (y)+(CIRCLE_RADIUS)*Math.sin(start);
        c.circle = sround;

        var tween = createjs.Tween.get(c, {loop:false}).to({angle:chValue(opt.value,100,360)}, 500, createjs.Ease.circInOut);
        tween.addEventListener("change", handleChange);
        function handleChange(event)
        {
            var start = 320*Math.PI/400;
            var s = event.target.target;
            s.angle += 1;
            var endAngle = (s.angle) * Math.PI / 180;
            s.graphics.clear();
            s.circle.x = (x)+(CIRCLE_RADIUS)*Math.cos(endAngle+start);
            s.circle.y = (y)+(CIRCLE_RADIUS)*Math.sin(endAngle+start);
            s.graphics.ss(s.thickness, "round", "round").s(s.color).arc(x, y, CIRCLE_RADIUS, 0+start, endAngle+start, false);
        }

        graph.addChild(b);
        graph.addChild(c);
        graph.addChild(sround);
        graph.addChild(txt1);
        content.addChild(graph);
        // ���ػ� ��������
        commonJs.graph.Resize({ canvas:canvas , img:canvas.next() , content:content , stage:stage })

        stage           =   new createjs.Stage(canvas.get(0));
        //stage.autoClear =   true;
        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener("tick", tick);
        function tick() { stage.update(); }
        stage.addChild(content);
        stage.update();
    }

    commonJs.financeGraph = function(opt)
    {
        var min = opt.min;
        var max = opt.max;
        var arr = opt.value;

        var li = $('div.financeGraph>div.graph').find('span.grpBar');
        for( var i=0; i<arr.length; i++)
        {
            var tm = li.eq(i);
            tm.stop().css('height',0);
            tm.animate({'height':((arr[i]-min)/(max-min))*2},400,'easeInOutCirc')
            tm.children('em').text(arr[i]);
        }
    }

    commonJs.financeGraph2 = function(opt)
    {
        var min = opt.min;
        var max = opt.max;
        var arr = opt.value;

        var li = $('div.financeGraph2>div.graph').find('span.grpBar');
        for( var i=0; i<arr.length; i++)
        {
            var tm = li.eq(i);
            tm.stop().css('height',0);
            tm.animate({'height':((arr[i]-min)/(max-min))*2},400,'easeInOutCirc')
            tm.children('em').text(arr[i]);
        }
    }

    function layer()
    {
        //
        commonJs.layerShow = function(str)
        {
            //console.log('layer' )

            var pop = doc.find(str);
            pop.show();
            var _box = pop.find('.layerBox');
            _box.css(
            {
                position    : 'fixed',
                'top'       :  '50%',
            });

            var popCon = _box.find('.popCon>.layerConJs');
            popCon.css('height','');
            // �˾�â ���Ĺ� ��ũ�� ������ ����
            var h = (_box.height() > winHeight )? winHeight - 200 : _box.height();

            popCon.css({
               'overflow-y'     :'auto',
                'height'        :h+'px'
            });

            var _h = _box.height();
            _box.css('margin-top',-_h/2+'px');

            var p = $('body').scrollTop();
            $('body').css('position','fixed');
            $('body').css('margin-top',-p+'px');
        }

        commonJs.layerHide = function(str)
        {
            //console.log('hide');
            var pop = doc.find(str);
            pop.hide();


            var p = parseInt($('body').css('margin-top'));
            $('body').css('position','');
            $('body').css('margin-top','');
            $('body').scrollTop(Math.abs(p));
        }

        doc.find('.layer , .message').each(function()
        {
            var _this = $(this);
            var _box = _this.find('.layerBox');
            _box.find('div.popClose , div.btnBox').on('click' , function(evt)
            {
                evt.preventDefault();
                //_this.hide();
                commonJs.layerHide('.layer , .message');
            });
        });

    }

    function globalMap()
    {
        var _list = doc.find('div.globalMap>div>a');
        _list.each(function()
        {
            $(this).on('click' , function()
            {
                var _this = $(this);
                _this.closest('div').removeAttr('class');
                _list.removeClass('on');

                var _this = $(this);
                var str = _this.attr('class');
                _this.addClass('on');
                _this.closest('div').addClass(str);
            });
        });

    }

    // �巡�� ����   sp>myfeedsearch.html
    commonJs.dragFeed = dragFeed;
    function dragFeed()
    {
        //
        var feedW   =   doc.find('.dragListJs');
        var li      =   feedW.children('li');
        var fW      =   0;
        feedW.css('width','');

        li.each(function(idx){
            fW  +=  $(this).outerWidth()+parseInt($(this).css('margin-left'))+parseInt($(this).css('margin-right'));
        });
        fW += 22;

        feedW.css('width',fW+'px');
        if( fW > winWidth )
        {
            var sx = 0;

            feedW.off('touchstart').on('touchstart', function(evt)
            {
                var e = evt.originalEvent;
                var offset = feedW.offset();
                dx = offset.left - e.targetTouches[0].pageX;
                feedW.on('touchmove', moveH);
            });

            function moveH(evt)
            {
                evt.preventDefault();
                var e = evt.originalEvent;
                var moveTouchX = e.targetTouches[0].pageX + dx;
                $(this).css('margin-left', moveTouchX);
            }
            feedW.off('touchend ,touchcancel').on('touchend ,touchcancel' , function(evt){
                feedW.off('touchmove', moveH);
                var x = parseInt( feedW.css('margin-left'));

                if (x < 0 && winWidth < fW + x) {
                }else{
                    if (  parseInt(feedW.css('margin-left')) < 0 )
                    {
                        feedW.stop().animate({'margin-left': winWidth-fW+'px' },300,'easeOutCirc')
                    }
                    if (winWidth < fW + parseInt( feedW.css('margin-left') ))
                    {
                        feedW.stop().animate({'margin-left': 0+'px' },300,'easeOutCirc')
                    }
                }
            });
        }
    }

    function form()
    {

      $('.floatingResizeJs').each(function()
      {
        $('body').on('change','input:checkbox',function(){
          var n = $('input:checkbox:checked').length;
          if(n==0)
          {
            $('div#content').css({
              'padding-bottom':29+'px'
            });
          }else{
            $('div#content').css({
              'padding-bottom':79+'px'
            });
          }
        });
      });

      $('.floatingJs').each(function()
      {

        var btn = $(this);
        var h = btn.height();
        btn.css('margin-top',-h+'px');
        var wh = $(window).innerHeight()-79;
      //  console.log(wh);
        $('div#content').css({
          'height':wh+'px',
          'overflow-y':'auto'
        });
      });

        $('.wholeAssetsBarJs').each(function()
        {
            var list = $(this);
            var btn = $('button.btnCp');
            btn.on('click',function()
            {
                $(this).addClass('on');
                $('body,html').css({
                    'overflow-x':'visible',
                    'overflow-y':'visible'
                });
                list.show();
                $('body,html').animate({'scrollTop':list.offset().top},300,'easeOutCirc');
            });
        });

        //$('div.setRtxt').each(function()
        $('.selectCountJs').each(function()
        {
            var setRtxt = $(this);
            var setT    = 0;
            setRtxt.css('opacity',0);
            $('input:checkbox').on('change',function()
            {
                if($('input:checkbox:checked').length < 4) {
                    var str = ($(this).is(':checked'))?'ī�װ����� �߰��Ǿ����ϴ�.':'ī�װ����� �����Ǿ����ϴ�.';
                    setRtxt.html('<em class="fColor1">'+$('label[for='+$(this).attr('id')+']').text()+'</em>'+ str );

                    setRtxt.show();
                    setRtxt.stop().animate({'opacity':1},100);
                    clearTimeout(setT);
                    setT = setTimeout(function(){
                        setRtxt.stop().animate({'opacity':0},100);
                    },1000);
                } else {
                    alert('My�ǵ� ������ �ִ� 3������ �����մϴ�');
                    $(this).prop('checked',false);
                    var form = $(this).closest('.form');
                    form.removeClass('checked');
                    return;
                }
            })
        });

        body.on('change','input:radio',function()
        {
            var name = $(this).attr('name');
            $('input[name$='+name+']').each(function()
            {
                var _this = $(this);
                var form = _this.closest('.form');
                var check = $('#'+$(this).attr('id'));
                if( _this.prop('checked') ){
                   //check.prop('checked')
                    form.addClass('checked');
                }else{
                    form.removeClass('checked');
                }
             });
        });

        body.on('change','input:checkbox' , function(evt)
        {
            var _this = $(this);
            var check =  doc.find('#'+$(this).attr('id') );
            var form = _this.closest('.form');

            if( check.is(':checked') )
            {
                form.addClass('checked');

            }else{
                form.removeClass('checked');

            }
        });
    }

    commonJs.searchFund = searchFund;
    function searchFund()
    {
           //naam202100.html
        doc.find('div.searchBox>div.btnArea>a.searchBtnJs').each(function()
        {
            $(this).on('click',function()
            {
                var input = doc.find('.searchInput');
                var keyword = doc.find('.keyword');

                if(input.length>0)
                {
                    input.show();
                    input.find('input:text').focus();
                    //keyword.show();
                }
                // 2016.06.16 ��ȹ��û���� ����Ʈ �ݱ� �߰�
                doc.find('.select1').each(function()
                {
                    var se = $(this);
                    se.removeClass('on');
                    se.find('.list').hide();
                    $('#content').css('height','');

                });

            });
        });

        doc.find('div.searchInput').each(function()
        {
            var input = $(this);
            var keyword = doc.find('.keyword');
            input.children('a.close').on('click',function()
            {
                input.hide();
                //keyword.hide();
            });
        });

        // ��ũ�� �̺�Ʈ test
        doc.find('.accordionJs1').each(function()
        {
            $('#wrap').before('<div class="loading" style="display:none"><span>�ε���</span></div>');

            var _this = $(this);
            _this.on('click','li>a',function(evt)
            {
                var li = $(this).closest('li');
                if( _this.hasClass('arcList') )
                {
                    evt.preventDefault();
                }
                var ch = li.hasClass('on');

                _this.children('li').removeClass('on');
                if(!ch)
                {
                    li.addClass('on');
                }
            });

            var time = null;
            var call = true;

            //��ũ�� �̺�Ʈ
            $(window).scroll(function () {
                if( !_this.hasClass('noMore') )
                {
                    if(time){
                        clearTimeout(time);
                    }

                    time = setTimeout(function()
                    {
                        //if( winHeight >= ($('body').height() - window.pageYOffset)-1000 && (startY < window.pageYOffset) && call)
                        if( (winHeight + 100) >= $(document).height() - $(this).scrollTop() && call)
                        {
                            if( !$('.select1').hasClass('on') )
                            {
                                call = false;
                                if(window['listCall'])
                                {
                                    listCall();

                                    setTimeout(function(){
                                        call = true;
                                    },290)
                                }
                            }
                        }
                    },300);
                }
            });
        });

        doc.find('.accordionJs').each(function()
        {
            $('#wrap').before('<div class="loading" style="display:none"><span>�ε���</span></div>');

            var _this = $(this);
            _this.on('click','li>a',function(evt)
            {
                var li = $(this).closest('li');
                if( _this.hasClass('arcList') )
                {
                    evt.preventDefault();
                }
                var ch = li.hasClass('on');

                // console.log('xx ',ch)

                _this.children('li').removeClass('on');
                if(!ch)
                {
                    li.addClass('on');
                }
            });

            if( !_this.hasClass('noMore') )
            {
            }

            var time = null;
            var call = true;
            var startY = 0;


            $('html,body').on('touchstart , touch',function()
            {
                startY = window.pageYOffset;
            });

            $('html,body').on('touchend , touchCancel',function(){
                if( !_this.hasClass('noMore') )
                {
                    if(time){
                        clearTimeout(time);
                    }
                    //alert('body '+$('body').height()+' pos window.pageYOffset '+window.pageYOffset  )
                    time = setTimeout(function()
                    {
                        if( winHeight >= ($('body').height() - window.pageYOffset)-1000 && (startY < window.pageYOffset) && call)
                        {
                            if( !$('.select1').hasClass('on') )
                            {
                                call = false;
                                if(window['listCall'])
                                {
                                    listCall();

                                    setTimeout(function(){
                                        call = true;
                                    },290)
                                }
                            }
                        }
                    },300);
                }
            });
        });
    }

    function tab()
    {
        doc.find('.tabJs').each(function(idx)
        {
            var _this = $(this);
            _this.children('li').on('click','a',function()
            {
                var list =  _this.children('li');
                list.removeClass('on');
                list.find('a>em.hidden').remove();
                var li = $(this).closest('li');
                li.addClass('on');
                doc.find('div.tabCon2>h3.hidden').text(li.text());
                li.find('a').append('<em class="hidden">����������</em>');
            });
        });
    }

    function Jessture( target )
    {
        var startX = 0;
        var startY = 0;
        var _this = $(this);
        var RIGHT = this.RIGHT = 'jsRight';
        var LEFT = this.LEFT = 'jsLeft';

        target.bind('touchstart , mousedown' , function(e)
        {
            if(e.type == 'mousedown'){
                // input �ʵ� üũ
                if( $(e.target).filter('input').length == 0){
                    e.preventDefault();
                }
                startX = e.pageX;
                startY = e.pageY;
            }else{
                startX = e.originalEvent.touches[0].pageX;
                startY = e.originalEvent.touches[0].pageY;
            }
        });

        target.bind( 'touchmove , mousemove' , function(e)
        {
            var endX = 0;
            var endY = 0;

            if(e.type != 'mousemove')
            {
                endX = e.originalEvent.touches[0].pageX;
                endY = e.originalEvent.touches[0].pageY;
            }
            if( Math.abs(startX - endX)>Math.abs(startY - endY) )
            {
                e.preventDefault();
            }
        });

        target.on('touchend , mouseup' , function(e)
        {
            var endX = 0;
            if(e.type == 'mouseup'){
            //if(!e.originalEvent.touches){
                endX = Number(e.pageX);
                e.preventDefault();
            }else{
                endX = Number(e.originalEvent.changedTouches[0].pageX);
            }

            if( Math.abs(startX - endX) > 70)
            {
                if(startX < endX)
                {
                    _this.trigger( RIGHT );
                }else{
                    _this.trigger( LEFT );
                }
            }
            startX = 0;
        });

        this.on = function( evt , func)
        {
            _this.on(evt , func );
        };
    }

    function swiper()
    {
        //
        //$('.slide').each(function()
        $('.swiperJs').each(function()
        {
            var slide = $(this);
            var jess = new Jessture(slide);
            var w = $(this).width();
            var cn   = 0;
            var list = slide.find('>ul>li');
            var tn   = list.length;
            var next = slide.find('>button.btnNext');
            var prev = slide.find('>button.btnPrev');
            var navi = slide.find('.navi').children();
            slide.find('>ul').css('width',(w*tn)+'px');
            slide.css('height',list.eq(0).outerHeight()+'px');

            next.on('click',prevH);
            prev.on('click',nextH);

            jess.on('jsRight',nextH);
            jess.on('jsLeft',prevH);

            function nextH()
            {
               if(cn>0)
               {
                   next.removeClass('end');
                   prev.removeClass('end');
                   cn--;
                   moveH(cn);
               }

                if(cn==0)
                {
                   prev.addClass('end');
                }
            }
            function prevH()
            {
               if(cn<tn-1)
               {
                   next.removeClass('end');
                   prev.removeClass('end');
                   cn++
                   moveH(cn);
               }

                if(cn==tn-1)
                {
                   next.addClass('end');
                }
            }

            function moveH(t)
            {
                slide.stop().animate({'height':list.eq(t).outerHeight()},400,'easeInOutCubic');
                slide.find('>ul').stop().animate({'margin-left':-(w*t)},400,'easeInOutCubic');
                navi.removeClass('on');
                navi.eq(t).addClass('on');
            }
        });
    }

    function tabCon()
     {
        $('.tabCon > .data:first-child').show();
        $('.tabType3 > li').bind('click', function(e){
            $this = $(this);
            $tabs = $this.parent().next();
            $target = $($this.data("target"));

            $this.siblings().removeClass('on');
            $target.siblings().css("display","none")
                $this.addClass('on');
                $target.fadeIn("fast");
        });
        $('.tabType3 > li:first-child').trigger('click');
    }
    function tabData()
    {
        $('.tabData ul li').click(function(){
            var activeTab = $(this).attr('data-tab');

            $('.tabData ul li').removeClass('on');
            $('.tabs').hide();
            $(this).addClass('on');
            $('#' + activeTab).show();
        });
    }
    function showChk()
    //����м� ���ǻ��� toggle
    {
        $('.showChk a').on('click',function(){
            $(this).parents('dl').toggleClass('on');
            return false;
        });
    }

    //�ֱ� ���̺� ���� 2020-11-20 �߰�
     function showChk1()
    {
        $('.showChk1 .btnToggle').on('click',function(){
            $(this).parents('div').toggleClass('on');
            return false;
        });
    }
    function scrTop()
    //�� ���� ��ư
    {
        var topBtn = $('.scrTop');
        topBtn.click(function(){
            $('html,body').animate({scrollTop:0}),300;
            return false;
        })
        $(window).scroll(function(){
            if($(this).scrollTop() > 200){
                topBtn.stop().fadeIn();
            }else{
                topBtn.fadeOut();
            }
        })
    }

    function menuLink()
    //�޴� ������ �̵�
    {
        $('.menuLink li a').click(function(){
        $('html,body').animate({scrollTop:$(this.hash).offset().top}),400;
        })
    }

    function tabSticky()
     //irp tab �̵�
    {
        var sticky = $('.tabSticky');
        var stickyLi = $('.tabSticky > li');
        var stickyLink = $('.tabSticky > li > a');
        var cont = $ ('.irpInfo .tabs');

        stickyLi.click(function(){
            $this = $(this);
            $tabs = $this.parent().next();

            $this.siblings().removeClass('on');
                $this.addClass('on');
        });
        $(window).scroll(function(){
            var sticky = $('.tabSticky');
            var stickyLi = $('.tabSticky > li'),
            scroll = $(window).scrollTop();
            swiperH = $('.swiper-container').height();

            //��� �����޴�
            if (scroll >= swiperH) sticky.addClass('fixed');
            else sticky.removeClass('fixed');

            if (scroll === 0){
                stickyLi.removeClass('on');
            }

            if (cont.length > 0){
                if(scroll >= cont.eq(0).offset().top - 100){
                    stickyLi.removeClass('on');
                    stickyLi.eq(0).addClass('on');
                }
                if(scroll >= cont.eq(1).offset().top - 100){
                    stickyLi.removeClass('on');
                    stickyLi.eq(1).addClass('on');
                }
                if(scroll >= cont.eq(2).offset().top - 100){
                    stickyLi.removeClass('on');
                    stickyLi.eq(2).addClass('on');
                }
            }
        })

        //�޴� ������ �̵�
        stickyLink.click(function(){
            $('html,body').animate({scrollTop:$(this.hash).offset().top - 90}),300;
        })
    }

    function arcList()
    // ���ڵ�� ��Ÿ�� �߰�
    {
        var dep1 = $('.arcList2');
        dep1.find('li>a').on('click', function (){
            var par = $(this).parent().closest('li');
            if(par.hasClass('on')){
                par.removeClass('on')
            }else{
                par.siblings().removeClass('on')
                par.addClass('on')
            }
        });

    }

    function fixTab()
    // ��� ���� ��
    {
        var fixTab = $('.fixTab');
        $(window).scroll(function(){
            if($(this).scrollTop()){
                fixTab.addClass('fixed');
            }else{
                fixTab.removeClass('fixed');
            }
        })
    }

    function tabScrTop2()
    {
        var fixTab = $('.tabScrTop');
        var fixTabLi = $('.tabScrTop > li');
        var scrollBody = $ ('#pgSchool .scrollBody');


        $('.scrTap').css('margin-top', scrollBody.height() - 8);
            $(window).resize(function(){
            $('.scrTap').css('margin-top', scrollBody.height() - 8);
        })

        fixTabLi.click(function(){
            $this = $(this);
            $tabs = $this.parent().next();

            $this.siblings().removeClass('on');
                $this.addClass('on');
        });
        $(window).scroll(function(){
            var fixTab = $('.tabScrTop');
            var fixTabLi = $('.tabScrTop > li'),
            scroll = $(window).scrollTop();
            scrollBody = $('.scrollBody').height() + 70;

            if (scroll >= scrollBody) fixTab.addClass('fixed');
            else fixTab.removeClass('fixed');

        })
    }
    function scrfixTop()
    {
        var topBtn = $('.scrTop2');
        topBtn.on('click', function(){
            if($(this).hasClass("type1") == false){
                $('html,body').animate({scrollTop:0}),300;
                return false;
            }
        })
        $(window).scroll(function(){
            if($(this).scrollTop() > 200){
                topBtn.stop().fadeIn().show();
                $('.popTip').css('bottom','140px');
            }else{
                topBtn.fadeOut().hide();
                $('.popTip').css('bottom','90px');
            }
        })

        var fixBtn = $('.fixMenuBtn');
        var popDimm = $('.popLayerDimm');


        fixBtn.click(function(){
            var posY = $(window).scrollTop();
            if(fixBtn.hasClass('comm')){
                fixBtn.removeClass('comm').addClass('show');
                popDimm.css('display','flex');
                $('body').addClass('overHidden').on('scroll touchmove mousewheel', function(e){
                    e.preventDefault();
                });
            }else{
                fixBtn.removeClass('show').addClass('comm');
                popDimm.css('display','none');
                $('body').removeClass('overHidden').off('scroll touchmove mousewheel');
                posY = $(window).scrollTop(posY);
                return false;
            }

        });
        $('.popLayerDimm, .popLayerDimm2').click(function(e){
            var posY = $(window).scrollTop();
            {
                fixBtn.removeClass('show').addClass('comm');
                //2020-11-09 �ּ�ó��
                // $('.popLayerDimm, .popLayerDimm2').css('display','none');
                $('body').removeClass('overHidden').off('scroll touchmove mousewheel');
                posY = $(window).scrollTop(posY);
                return false;
            }
        });

    }

    function linkLayer()
    {
        var linkBtn = $('.boxTit .btnInfo');
        linkBtn.click(function(){
            var $href = $(this).attr('href');
            layer_pop($href);
        });
        function layer_pop(el){
            var $el = $(el);
            var posY = $(window).scrollTop();
            $el.css('display','flex');
            $('body').addClass('overHidden').on('scroll touchmove mousewheel', function(e){
                e.preventDefault();
             });
            $('.popup').css('top',-posY);
            $el.find('a.close, button.close').click(function(){
                $el.css('display','none');
                $('body').removeClass('overHidden').off('scroll touchmove mousewheel');
                posY = $(window).scrollTop(posY);
                return false;
            });
        }
    }

    function linkLayer2()
    {
        var linkBtn = $('.boxTit .btnInfo');
        linkBtn.click(function(){
            var $href = $(this).attr('data-target');
            layer_pop($href);
        });
        function layer_pop(el){
            var $el = $(el);
            var posY = $(window).scrollTop();
            $el.css('display','flex');
            $('body').addClass('overHidden').on('scroll touchmove mousewheel', function(e){
                e.preventDefault();
             });
            $('.popup').css('top',-posY);
            $el.find('a.close, button.close').click(function(){
                $el.css('display','none');
                $('body').removeClass('overHidden').off('scroll touchmove mousewheel');
                posY = $(window).scrollTop(posY);
                return false;
            });
        }
    }

    $(function()
    {
        winHeight = $(window).height();
        winWidth = $(window).width();

        doc = $(document);
        body = $('body');
        formReoad();
        tab();
        layer();
        searchFund();
        globalMap();
        tabCon();
        tabData();
        showChk();
        showChk1(); // 2020-11-20�߰�
        scrTop();
        menuLink();
        tabSticky();
        arcList();
        fixTab();
        //�̽�����
        if($("#pgSchool").html() !== undefined){
            tabScrTop2();
        }
        scrfixTop();
        linkLayer();
        linkLayer2();

    });
    $(window).load(function(){
        dragFeed();
        swiper();
        form();
    });
})
(jQuery,window);

//����Ʈ �ڽ�
(function( $ , window )
{
    if( !window.commonJs )
    {
        window.commonJs = {};
    }
    var commonJs = window.commonJs;

    commonJs.selectBox = {};
    var indexSB=0;

    commonJs.setSelectBox=function(trgt)
    {
        //console.log('trgt ',trgt)
        $.fn.getInstance = function()
        {
            //console.log('xxx')
            return this.data('scope' );
        }

        var _this;
        $(trgt).each(function ()
        {
            //_this = $(this);
            _this = $(this);
            var OrglSlt=$(this);
            var OrglSltOpt;
            var SelectBox;

            var sltArrTxt=[];
            var sltArrVal=[];
            var sltIdx;
            var sltTxt;
            var sltVal;
            var sltLen;
            var sltBoxIdx=indexSB;
            indexSB++;

            var bfSpanTxt;
            var lsEm;
            var afSpanTxt;

            var isSlt2=false;
            var layerSelect;
            var selectList;
            var selectListLi;
            var selectListA;
            var selectBoxA;
            var selectBoxSpan;
            var selectType;

            var _init=function()
            {
                _this.data('scope',_this);
                OrglSltOpt=OrglSlt.children('option');
                OrglSlt.children('option').each(function(){
                    sltArrTxt.push($(this).text());
                    sltArrVal.push($(this).attr('value'));
                });

                sltLen=sltArrTxt.length;
                isSlt2=OrglSlt.hasClass('select2');

                selectType = isSlt2
                OrglSlt.hide();

                _creatLayout2(OrglSlt);
                _setEvent();

                var i=OrglSlt.find('option:selected').index();
                _selectListByIdx(i);
                //_setApi();
            };

            var _creatLayout2=function(target)
            {
                // �޴�����
                var tmpStr='<div class="select1" id="ls_'+sltBoxIdx+'">';
                tmpStr += '<a><span>'+OrglSlt.attr('title')+'</span></a>';
                tmpStr+='<ul class="list">';
                for(var i=0;i<sltArrTxt.length;i++)
                {
                    tmpStr+='<li><a href="#"><span>'+sltArrTxt[i]+'</span></a></li>';
                }

                tmpStr+='</ul>';
                tmpStr+='</div>';

                OrglSlt.parent().append(tmpStr);
                SelectBox=$("#ls_"+sltBoxIdx);

                selectList=layerSelect=SelectBox.children('ul.list')
                selectListLi=selectList.find('li');
                selectListA=selectListLi.children('a');
                selectBoxA=SelectBox.children('a');
                selectBoxSpan=selectBoxA.children('span');
            };


            var wHeight=$(window).height();

            var _sortLayerSelect=function()
            {
                if(!isSlt2){
                    return
                }
            };

            var _selectListByIdx=function(idx){
                if(!(typeof idx=="number")) return false;

                selectListLi.removeClass('on');
                selectListLi.eq(idx).addClass('on');
                sltIdx=idx;
                sltTxt=sltArrTxt[idx];

                sltVal=sltArrVal[idx];

                selectListA.attr('title','');
                selectListA.eq(idx).attr('title','����');

                selectBoxSpan.html(sltTxt);

                if(isSlt2){
                    lsEm.html(sltTxt);
                }
                _sortLayerSelect();
                OrglSlt.find('option').removeAttr('selected').eq(idx).prop('selected',true).parent('select').trigger('change.selectbox', _getInfoSB());

                return sltIdx;
            };

            var _selectListByTxt=function(val){
                for(var i=0;i<sltLen;i++){
                    if(sltArrTxt[i]==val) {
                        return _selectListByIdx(i);
                    }
                }
                return false;
            };

            var _selectListByValue=function(val){
                for(var i=0;i<sltLen;i++){
                    if(sltArrVal[i]==val) {
                        return _selectListByIdx(i);
                    }
                }
                return false;
            };

            var _selectBoxHandler = function(e)
            {
                e.preventDefault();
                var _this = $(this).closest('div');
                if(_this.hasClass('on')){
                    layerSelect.hide();
                    _this.removeClass('on');

                    $('div#content').css('height','');
                    $( 'html, body' ).animate( { scrollTop : 0 }, 1 );

                }else{
                    // 2016.06.16 ��ȹ��û���� ����Ʈ �ݱ� �߰�
                    $('div#content').css('height','');
                    $('.select1').removeClass('on');
                    $('.select1>.list').hide();
                    //

                    var n = _this.find('.list').height();
                    if( n > wHeight){
                       $('div#content').css('height',n+29+'px');
                    }

                    layerSelect.show();
                    _this.addClass('on');
                }
                _sortLayerSelect();
            }

            var _setEvent=function(){
                selectBoxA.on('click', _selectBoxHandler );

                var curTop;
                selectListA.on('click',function(e)
                {
                    e.preventDefault();

                    var thisLi=$(this).parent();
                    if(thisLi.hasClass('disabled')) return;

                    var idx=thisLi.index();
                    _selectListByIdx(idx);

                    selectBoxA.closest('div').removeClass('on');
                    layerSelect.hide();
                    $('div#content').css('height','');
                    $( 'html, body' ).animate( { scrollTop : 0 }, 1 );

                    SelectBox.trigger('choice.selectbox', _getInfoSB());
                });
            };

            var _remove=function(){
                SelectBox.before(OrglSlt[0]);

                var retVal=SelectBox.prev();
                retVal.show();
                SelectBox.remove();
                layerSelect.remove();

                OrglSlt=null;
                OrglSltOpt=null;
                sltArrTxt=[];
                sltArrVal=[];
                sltIdx=null;
                sltTxt=null;
                sltVal=null;
                sltLen=null;
                bfSpanTxt=null;
                lsEm=null;
                afSpanTxt=null;
                isSlt2=false;
                layerSelect=null;
                selectList=null;
                selectListLi=null;
                selectListA=null;
                selectBoxA=null;

                return retVal;
            };

            var _resetSB=function(){
                OrglSlt=_remove();
                return _initSB();
            };

            var _initSB=function(){
                if(!OrglSlt) return false;
                _init();
                return SelectBox;
            };

            var _disabledSB=function(){
                SelectBox.addClass('disabled');
                selectBoxA.off();
            };

            var _enabledSB = function()
            {
                SelectBox.removeClass('disabled');
                selectBoxA.off().on('click',_selectBoxHandler);
            };

            var _getInfoSB=function(){
                return {
                    index:sltIdx,
                    value:sltVal,
                    text:sltTxt
                };
            };

            var _visibleSB = function( value )
            {
                if( value ){
                    SelectBox.show();
                }else{
                    SelectBox.hide();
                }
            };

            _this.getInfoSB = function(){   return _getInfoSB();    }
            _this.getIndexSB = function(){  return _getInfoSB();    }
            _this.getValueSB = function(){  return _getInfoSB();    }
            _this.getTextSB = function(){   return _getInfoSB();    }
            _this.setIndexSB = function(val){   return _selectListByIdx(val);   }
            _this.setTextSB = function(val){    return _selectListByTxt(val);   }
            _this.setValueSB = function(val){   return _selectListByValue(val); }
            _this.removeSB = function(){    return _remove();   }
            _this.resetSB = function(){     return _resetSB();  }
            _this.disabledSB = function(){  return _disabledSB();   }
            _this.enabledSB = function(){   return _enabledSB();    }
            _this.visibleSB = function(val){   return _visibleSB(val);    }
            _init();
        });
    };

    $( function(){
        //commonJs.setSelectBox('.select1');
    } );
})
(jQuery,window);

/**
 * datepicker
 */
//����Ʈ �ڽ�
(function( $ , window ) {
    if (!window.commonJs) {
        window.commonJs = {};
    }
    var commonJs = window.commonJs;

    commonJs.DateBox = (function() {
        var defaults = {
            year : '.year',
            month : '.month',
            day : '.day',

            yearRange : '-5:+5'
        };

        /**
         * DateBox ( flipbox datepicker )
         * @global
         * @param {jQuery | HTMLElement} target DateBox Selector
         * @param {Object} settings DateBox option
         * @param {String} settings.year year element class name
         * @param {String} settings.month month element class name
         * @param {String} settings.day day element class name\
         *
         * @constructor
         */
        function DateBox (target, settings) {
            this.wrapper = $(target);

            if(!this.wrapper.length) { return; }

            // target�� ���� ������ �� ��
            if(this.wrapper.length > 1) {
                this.wrapper.each(function() {
                    var dateFlipbox = new DateBox(this, settings);
                });

                return this;
            }

            // �̹� Jscroll�� �����Ǿ� ���� ���
            if(this.wrapper.data('DateBox')){
                this.wrapper.data('DateBox').refresh();
                return this;
            }

            this._init(settings);
        }

        DateBox.prototype = {
            constructor : DateBox,

            _init : function (settings) {
                this.settings = $.extend({}, defaults, settings);
                this.settings.yearRange =  this.wrapper.attr('data-yearRange') ? this.wrapper.attr('data-yearRange') : this.settings.yearRange;
                this.yearElem = this.wrapper.find(this.settings.year);
                this.monthElem = this.wrapper.find(this.settings.month);
                this.dayElem = this.wrapper.find(this.settings.day);

                // date ������ ���� ��ü ����
                this.dateInfo = {};
                // ���� �ð� ����
                this.dateInfo.today = new Date().toJSON().slice(0,10).replace(/-/g,'/').split('/');
                this.dateInfo.lastDay = (new Date(this.dateInfo.year, this.dateInfo.month, 0)).getDate();
                this.dateInfo.year = parseInt(this.dateInfo.today[0], 10);
                this.dateInfo.month = parseInt(this.dateInfo.today[1], 10);
                this.dateInfo.day = parseInt(this.dateInfo.today[2], 10);


                this._setup();

                // data ����
                this.wrapper.data('DateBox', this);

                return this;
            },

            _setup : function() {
                this._createYear();
                this._createMonth();
                this._createDay();

                this._swiperInit();
                this._bindEvents();

                // �ʱ� ����
                this.setDate(this.dateInfo);
            },

            _bindEvents : function() {
                var _this = this;

                this.wrapper.on('click.datepicker', 'ul > li', function(e) {
                    var ulData = $(e.target).closest('ul').data('jscroll');

                    if(ulData) {
                        ulData.scrollTo($(this).index());
                    }
                });
            },

            _createYear : function () {
                var $year = this.yearElem,
                    yearRange = this.settings.yearRange.split(':'),
                    getTodayYear = parseInt(this.dateInfo.today[0], 10),
                    minYear = getTodayYear + parseInt(yearRange[0], 10),
                    maxYear = getTodayYear + parseInt(yearRange[1], 10);

                this._createList({
                    target : $year,
                    minValue : minYear,
                    maxValue : maxYear
                });
            },

            _createMonth : function () {
                var $month = this.monthElem;

                this._createList({
                    target : $month,
                    minValue : 1,
                    maxValue : 12
                });
            },

            _createDay : function () {
                var $day = this.dayElem;
                this.dateInfo.lastDay = (new Date(this.dateInfo.year, this.dateInfo.month, 0)).getDate();

                this._createList({
                    target : $day,
                    minValue : 1,
                    maxValue : this.dateInfo.lastDay
                });
            },

            _createList : function (opts) {
                var opts = opts || {},
                    $target = $(opts.target),
                    min = opts.minValue,
                    max = opts.maxValue,
                    $docFrag = $(document.createDocumentFragment()),
                    li = null,
                    index = 0;

                for(var i=min; i<=max; i++) {
                    li = $('<li />');
                    index = i < 10 ? '0' + (i) : i;
                    li.attr('data-value', parseInt(index, 10)).html('<a href="#">' + index + '</a>');
                    $docFrag.append(li);
                }

                $target.html($docFrag);

                // swiper�� ����Ǿ� �ִٸ� refresh
                if($target.data('jscroll')) {
                    $target.data('jscroll').refresh();
                }
            },

            _swiperInit : function() {
                var _this = this;
                this.yearScroll = new commonJs.Jscroll(this.yearElem, {
                    onAfterChange: function(swiper) {
                        _this.dateInfo.year = swiper.li.eq(swiper.currentIndex).attr('data-value');
                        _this._changeDays();
                    }
                });
                this.monthScroll = new commonJs.Jscroll(this.monthElem, {
                    onAfterChange: function(swiper) {
                        _this.dateInfo.month = swiper.li.eq(swiper.currentIndex).attr('data-value');
                        _this._changeDays();
                    }
                });
                this.dayScroll = new commonJs.Jscroll(this.dayElem, {
                    onAfterChange: function(swiper) {
                        _this.dateInfo.day = swiper.li.eq(swiper.currentIndex).attr('data-value');
                    }
                });
            },

            _changeDays : function () {
                this._createDay();
                if(this.dayScroll.currentIndex > this.dateInfo.lastDay - 1){
                    this.dayScroll.currentIndex = this.dateInfo.lastDay - 1
                }
                this.dayScroll.refresh();
            },

            /**
             * @memberOf DateBox
             * @method
             * @param {Object} opts �����ų option
             * @param {Number} opts.year �����ų ��
             * @param {Number} opts.month �����ų ��
             * @param {Number} opts.day �����ų ��
             *
             * @example
             * // datebox �ʱ�ȭ
             * var datebox = new DateBox(target, option);
             *
             * // datebox date �� �Ʒ� ��¥�� ����
             * datebox.setDate({
             *     year : 2017,
             *     month : 12,
             *     day : 31
             * });
             */
            setDate : function (opts) {
                if(!opts) { return; }

                var getYearValue = opts.year ? this.yearElem.find('[data-value="' + parseInt(opts.year, 10) + '"]').index() : this.yearElem.data('jscroll').currentIndex,
                    getMonthValue = opts.month ? this.monthElem.find('[data-value="' + parseInt(opts.month, 10) + '"]').index() : this.monthElem.data('jscroll').currentIndex,
                    getDayValue = opts.day ? this.dayElem.find('[data-value="' + parseInt(opts.day, 10) + '"]').index() : this.dayElem.data('jscroll').currentIndex;

                this.yearScroll.currentTo(getYearValue);
                this.monthScroll.currentTo(getMonthValue);
                this.dayScroll.currentTo(getDayValue);
            },

            /**
             * ���� ���õ� ��¥ get
             * @memberOf DateBox
             * @method
             * @returns {Array} [Year, Month, Day]
             *
             * @example
             * // datebox �ʱ�ȭ
             * var datebox = new DateBox(target, option);
             *
             * // [YYYY, MM, DD] ���·� �迭 ����
             * datebox.getDate();
             */
            getDate : function () {
                var curYear = parseInt(this.yearScroll.li.eq(this.yearScroll.currentIndex).attr('data-value'), 10),
                    curMonth = parseInt(this.monthScroll.li.eq(this.monthScroll.currentIndex).attr('data-value'), 10),
                    curDay = parseInt(this.dayScroll.li.eq(this.dayScroll.currentIndex).attr('data-value'), 10);

                if(curMonth < 10) {
                    curMonth = '0' + curMonth;
                }

                if(curDay < 10) {
                    curDay = '0' + curDay;
                }

                return [curYear, curMonth, curDay];
            },

            /**
             * �޷� refresh
             * @memberOf DateBox
             * @method
             */
            refresh : function() {
                this.setDate(this.dateInfo);

                this.yearScroll.refresh();
                this.monthScroll.refresh();
                this.dayScroll.refresh();
            }
        };

        return DateBox;
    }());

    commonJs.Jscroll = (function() {
        // cubic-bezier(0.1, 0.57, 0.1, 1)
        // easing �ɼ� �߰�
        if(!$.easing.hasOwnProperty('circularOut')) {
            $.extend($.easing, {
                'circularOut' : function(k) {
                    return Math.sqrt(1 - (--k * k));
                }
            });
        }

        var defaults = {
            container : '.js-scroll-container',
            wrapper : '.js-scroll-wrapper',

            activeClass : 'on',

            // animation option
            easing : 'circularOut',
            duration : 'fast',

            onInit : function(swiper) {},
            onBeforeChange : function(swiper, oldIdx, newIdx) {},
            onAfterChange : function(swiper, oldIdx, newIdx) {},
            onResize : function(swiper) {}
        };

        /**
         * Jscroll
         * @global
         * @param {jQuery | HTMLElement} target selector
         * @param {Object} settings Jscroll option
         * @param {String} settings.container Jscroll container element class name
         * @param {String} settings.wrapper Jscroll wrapper element class name
         * @param {String} settings.activeClass Jscroll Ȱ��ȭ �����϶� ������ class name
         * @param {String} settings.easing Jscroll animation easing value
         * @param {String} settings.duration Jscroll animation duration value
         * @param {Function} settings.onInit init callback
         * @param {Function} settings.onBeforeChange BeforeChange callback
         * @param {Function} settings.onAfterChange AfterChange callback
         * @param {Function} settings.onResize onResize callback
         *
         * @example
         * var jscroll = new commonJs.Jscroll(target, settings);
         *
         * @constructor
         */
        function Jscroll(target, settings) {
            var _this = this,
                imgCount = 0,
                imgLen = 0;

            this.ul = $(target);

            if(!this.ul.length) { return; }

            // target�� ���� ������ �� ��
            if(this.ul.length > 1) {
                this.ul.each(function() {
                    var jscroll = new Jscroll(this, settings);
                });

                return this;
            }

            // �̹� Jscroll�� �����Ǿ� ���� ���
            if(this.ul.data('jscroll')){
                this.ul.data('jscroll').refresh();
                return this;
            }

            // �ʱ�ȭ
            this._init(settings);

            // �̹����� ���� ��� �̹����� �ε�� �� refresh();
            imgLen = this.ul.find('img').length;
            if(imgLen > 0) {
                this.ul.find('img').one('load', function () {
                    imgCount += 1;
                    if (imgCount === imgLen) {
                        _this.refresh();
                    }
                }).each(function () {
                    if (this.complete) {
                        $(this).trigger('load');
                    }
                });
            }
        }

        /**
         * Jscroll init
         * @param {Object} settings Jscroll settings
         * @private
         */
        Jscroll.prototype._init = function(settings) {
            // settings object
            this.settings = $.extend({}, defaults, settings);
            // Container Element
            this.container = this.ul.closest(this.settings.container);
            // Wrapper Element
            this.wrapper = this.ul.parent(this.settings.wrapper);

            // functions start
            this._start();

            // init callback
            if(typeof this.settings.onInit === 'function') {
                this.settings.onInit(this);
            }

            // data ����
            this.ul.data('jscroll', this);

            return this;
        };

        /**
         * functions start
         * @private
         */
        Jscroll.prototype._start = function() {
            this._setup();
            this._render();
            this._bindEvents();
            this._touchInit();
            this._onClass();
        };

        /**
         * Style Setup
         * @private
         */
        Jscroll.prototype._setup = function() {
            // Wrapper�� ���� ��� ����
            if(!this.wrapper.length) {
                this.ul.wrap('<div class="' + this.settings.wrapper.substring(1) + '" />');
                this.wrapper = this.ul.parent(this.settings.wrapper);
            }

            this.wrapper.css({
                overflow: 'hidden',
                height: '100%'
            });

            // ul
            this.ul.css({
                position: 'relative',
                overflow: 'hidden'
            });

            // ���� ���õ� index �� ����
            this.currentIndex = this.ul.children().filter('.on').index() > 0 ? this.ul.children().filter('.on').index() : 0;
        };

        /**
         * rendering
         * @private
         */
        Jscroll.prototype._render = function() {
            // list item ����
            this.li = this.ul.children();
            // list item length ����
            this.liLen = this.li.length;

            this.minY = 0;
            this.maxY = this._getMaxMove();

            // li position �� ����
            this.liPos = this._getPosition();

            // ������ li position ������ min, max �� �缳��
            this.minY = this.liPos.y[0];
            this.maxY = this.liPos.y[this.liLen-1];

            // set move value
            this.ul.css({
                marginTop: this.liPos.y[this.currentIndex] + 'px'
            });
        };

        /**
         * current item add / remove class
         * @private
         */
        Jscroll.prototype._onClass = function(idx) {
            var getIdx = idx || this.currentIndex,
                $curLi = this.li.eq(getIdx),
                $liSiblings = $curLi.siblings();

            $liSiblings.removeClass(this.settings.activeClass);
            $curLi.addClass(this.settings.activeClass);
        };

        /**
         * bindEvents
         * @private
         */
        Jscroll.prototype._bindEvents = function() {
            var _this = this,
                resizeTimer = null;

            // resize event ����
            $(window).on('resize.swiper', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    _this._resize();
                }, 100);
            });
        };

        /**
         * Jscroll ���� ����� �̺�Ʈ ��� ����
         * @private
         */
        Jscroll.prototype._unBindEvents = function() {
            $(window).off('resize.swiper');
            this.container.off('touchstart.swiper');
        };

        /**
         * resize event
         * @private
         */
        Jscroll.prototype._resize = function() {
            this._render();

            // Resize Callback Function
            if(typeof this.settings.onResize === 'function') {
                this.settings.onResize(this);
            }
        };

        /**
         * touch init
         * @private
         */
        Jscroll.prototype._touchInit = function() {
            // touch option ��
            this.touchOption = {
                locked : 'n',                       // scroll lock ( v : vertical, h : horizontal, n : none)
                threshold : 15,
                deceleration : 0.002,
                x : 0,                              // ul move x value

                point : {
                    x : 0,
                    y : 0
                },

                // touch start value
                start : {
                    x : 0,
                    y : 0
                },

                // touch move value
                move : {
                    x : 0,
                    y : 0
                }
            };

            // fliking ���� ��ũ�� ������ ����
            this.container.on('touchstart.swiper', $.proxy(this._onTouchStart, this));
        };

        /**
         * touchstart event
         * @param e
         * @private
         */
        Jscroll.prototype._onTouchStart = function(e) {
            e.preventDefault();

            var origin = e.originalEvent,
                point = (typeof origin.changedTouches !== 'undefined') ? origin.changedTouches : [origin];

            if(this.ul.is(':animated')) {
                this.ul.stop(true, false);
            }

            // locked 'n'������ �缳��
            this.touchOption.locked = 'n';
            this.touchOption.move.x = 0;
            this.touchOption.move.y = 0;
            this.touchOption.point.x = point[0].pageX;
            this.touchOption.point.y = point[0].pageY;
            this.touchOption.y = parseInt(this.ul.css('margin-top'), 10);
            this.touchOption.start.y = parseInt(this.ul.css('margin-top'), 10);
            // momentum timestamp
            this.touchOption.startTime = new Date().getTime();

            this.container.on('touchmove.swiper', $.proxy(this._onTouchMove, this));
            this.container.on('touchend.swiper', $.proxy(this._onTouchEnd, this));
        };

        /**
         * touchmove event
         * @param e
         * @private
         */
        Jscroll.prototype._onTouchMove = function(e) {
            var origin = e.originalEvent,
                point = (typeof origin.changedTouches !== 'undefined') ? origin.changedTouches : [origin],
                deltaX = point[0].pageX - this.touchOption.point.x,
                deltaY = point[0].pageY - this.touchOption.point.y,
                timestamp = new Date().getTime(),
                absX, absY;

            this.touchOption.point.x = point[0].pageX;
            this.touchOption.point.y = point[0].pageY;

            this.touchOption.move.x += deltaX;
            this.touchOption.move.y += deltaY;

            absX = Math.abs(this.touchOption.move.x);
            absY = Math.abs(this.touchOption.move.y);

            // y ��ũ�� ����
            if (absX > absY + this.touchOption.threshold && this.touchOption.locked !== 'h') {
                this.touchOption.locked = 'v';

                // x ��ũ�� ����
            } else if ( absY >= absX + this.touchOption.threshold && this.touchOption.locked !== 'v') {
                this.touchOption.locked = 'h';
            }

            // x move
            if(this.touchOption.locked === 'h') {
                e.preventDefault();

                this.touchOption.y = this.touchOption.y + deltaY;

                this.ul.css('margin-Top', this.touchOption.y + 'px');

                // momentum timestamp
                if(timestamp - this.touchOption.startTime > 100) {
                    this.touchOption.startTime = timestamp;
                    this.touchOption.start.y = this.touchOption.y;
                }

                this.currentIndex = this._getMoveIndex(this.touchOption.y);
                this._onClass();
            }
        };

        /**
         * touchend event
         * @param e
         * @private
         */
        Jscroll.prototype._onTouchEnd = function(e) {
            var duration = new Date().getTime() - this.touchOption.startTime,
                momentumX,
                newY = this.touchOption.y,
                time;

            this.touchOption.endTime = new Date().getTime();

            // momentum value ����
            if(duration < 150) {
                if(this.touchOption.locked === 'h' && this.touchOption.y < this.minY && this.touchOption.y > this.maxY) {
                    momentumX = this._momentum(this.touchOption.y, this.touchOption.start.y, duration, this.minY, this.maxY, this.touchOption.deceleration);
                    newY = momentumX.destination;
                    time = momentumX.duration;
                }
            }

            // ���� ��ũ��
            if(this.touchOption.locked === 'h') {
                this.scrollTo(this._getMoveIndex(newY), time);
            } else {
                // touchstart, touchend �ð����� Ŭ�� üũ
                if(this.touchOption.endTime - this.touchOption.startTime < 150) {
                    $(e.target).trigger('click');

                 // Ŭ���� �ƴ� ��� ���� ������ �� �̵� (�߰����� ���ߴ� ���� ����)
                } else {
                    this.scrollTo(this.currentIndex);
                }
            }

            this.touchOption.locked = 'n';
            this.container.off('touchmove.swiper');
            this.container.off('touchend.swiper');
        };

        /**
         * Jscroll momentum
         * @private
         */
        Jscroll.prototype._momentum = function(current, start, time, minValue, maxValue, deceleration) {
            var distance = current - start,
                speed = Math.abs(distance) / time,
                destination,
                duration;

            deceleration = this.touchOption.deceleration ? this.touchOption.deceleration : 0.0006;

            destination = current + (speed * speed ) / (2 * deceleration) * (distance < 0 ? -1 : 1);

            duration = speed / deceleration;

            duration = duration > this.settings.duration ? this.settings.duration : duration;

            if (destination < maxValue) {
                destination = maxValue;
                distance = Math.abs(maxValue - current);
                duration = distance / speed;
            } else if (destination > minValue) {
                destination = minValue;
                distance = Math.abs(current);
                duration = distance / speed;
            }

            return {
                destination: Math.round(destination),
                duration: duration
            };
        };

        /**
         * ����Ʈ�� position ���� ������ ��ü ����
         * @returns {Object}
         * @private
         */
        Jscroll.prototype._getPosition = function() {
            var _this = this,
                arr = {
                    // li outerWidth(true)
                    w : [],
                    // li outerHeight(true)
                    h : [],
                    // li position left
                    x : [],
                    // li position top
                    y : []
                };

            this.li.each(function(index) {
                var getWidth = parseInt($(this).outerWidth(true)),
                    getHeight = parseInt($(this).outerHeight(true)),
                    getX = -parseInt($(this).position().left, 10),
                    getY = -parseInt($(this).position().top, 10),
                    getPaddingX = Math.abs(_this.wrapper.innerWidth() - getWidth) / 2,
                    getPaddingY = Math.abs(_this.wrapper.innerHeight() - getHeight) / 2;

                getX = getPaddingX - Math.abs(getX);
                getY = getPaddingY - Math.abs(getY);

                arr.w[index] = getWidth;
                arr.h[index] = getHeight;
                arr.x[index] = getX;
                arr.y[index] = getY;
            });
            return arr;
        };

        /**
         * �̵��� x, y ������ ���� ��ġ�� ����Ʈ index return
         * @param {Number} moveValue ���� �̵� ��
         * @private
         */
        Jscroll.prototype._getMoveIndex = function(moveValue) {
            var pos = this.liPos,
                posY = pos.y,
                min = 0,
                max = posY.length -1,
                guess = 0,
                total = 0,
                minValue = 0,
                maxValue = 0,
                result = -1;

            while (min <= max) {
                guess = Math.floor((min + max) / 2);
                total++;
                if(moveValue === posY[guess]) {
                    // console.log('complete', 'min: ', min, ' max: ', max);
                    result = guess;
                    break;
                } else if (posY[guess] > moveValue) {
                    // console.log('min', 'min: ', min, ' max: ', max);
                    min = guess+1;
                } else if (posY[guess] < moveValue) {
                    // console.log('max', 'min: ', min, ' max: ', max);
                    max = guess-1;
                } else {
                    break;
                }
            }

            if(max < 0) {
                result = 0;
            } else if (min > posY.length - 1){
                result = posY.length - 1;
            } else {
                minValue = Math.abs(posY[min] - moveValue);
                maxValue = Math.abs(posY[max] - moveValue);

                result = minValue <= maxValue ? min : max;
            }
            // console.log('result', 'min: ', min, ' max: ', max);
            return result;
        };

        /**
         * Max Move Value
         * @returns {number}
         * @private
         */
        Jscroll.prototype._getMaxMove = function() {
            var getValue = this.wrapper.innerHeight() - this.ul.innerHeight();

            return getValue < 0 ? getValue : 0;
        };

        /**
         * index�� �ش��ϴ� ����ŭ �̵� ( �ִϸ��̼� ���� )
         * @param {Number} index item index (�ʼ� ��)
         * @param {Number} duration animation duration
         * @memberOf Jscroll
         * @method
         * @example
         * // �������� �ʱ�ȭ
         * var jscroll = new Jscroll(target, settings);
         *
         * // �ι�° �����̵�� �̵�
         * jscroll.scrollTo(1);
         */
        Jscroll.prototype.scrollTo = function(index, duration) {
            var _this = this,
                oldIndex = this.currentIndex,
                getDuration = typeof duration !== 'undefined' ? duration : this.settings.duration;

            if(this.ul.is(':animated')) { return; }


            this.currentIndex = index;

            if(this.currentIndex < 0) {
                this.currentIndex = 0;
            } else if (this.currentIndex > this.li.length - 1){
                this.currentIndex = this.li.length - 1;
            }

            // Before Change Callback Function
            if(typeof this.settings.onBeforeChange === 'function') {
                this.settings.onBeforeChange(this, oldIndex, this.currentIndex);
            }

            this.ul.stop(true, false).animate({
                marginTop : this.liPos.y[this.currentIndex] + 'px'
            }, {
                duration : getDuration,
                easing : this.settings.easing,
                complete : function() {
                    // After Change Callback Function
                    if(typeof _this.settings.onAfterChange === 'function') {
                        _this.settings.onAfterChange(_this, oldIndex, _this.currentIndex);
                    }
                }
            });

            this._onClass();
        };

        /**
         * index�� �ش��ϴ� ����ŭ �̵� ( �ִϸ��̼� ���� )
         * @param {Number} index item index
         * @memberOf Jscroll
         * @method
         * @example
         * // �������� �ʱ�ȭ
         * var jscroll = new Jscroll(target, settings);
         *
         * // �ι�° �����̵�� �̵�
         * jscroll.currentTo(1);
         */
        Jscroll.prototype.currentTo = function(index) {
            this.scrollTo(index, 0);
        };

        /**
         * �����̵� ���ΰ�ħ
         * @memberOf Jscroll
         * @method
         * @example
         * // �������� �ʱ�ȭ
         * var swiper = new Jscroll(target, settings);
         *
         * // �����̵� ���ΰ�ħ
         * jscroll.refresh();
         */
        Jscroll.prototype.refresh = function() {
            this._render();
            this._onClass();
        };

        /**
         * �����̵� ��� �ı�
         * @memberOf Jscroll
         * @method
         * @example
         * // �������� �ʱ�ȭ
         * var swiper = new Jscroll(target, settings);
         *
         * // �����̵� ��� �ı�
         * swiper.refresh();
         */
        Jscroll.prototype.destroy = function() {
            this._unBindEvents();
            this.ul.removeAttr('style');
            this.li.removeAttr('style');
            this.ul.removeData('swiper');
        };

        return Jscroll;
    }());
})
(jQuery,window);

(function( $ , window ){
    //Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-104543332-1', 'auto');

    //Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WVFVQC2');
    //End Google Tag Manager
})
(jQuery,window);
//���� ��ũ

//�̽�����
function tabScrTop()
{
    var fixTab = $('.tabScrTop');
    var fixTabLi = $('.tabScrTop > li');
    var scrollBody = $ ('.scrollBody');


    $('.scrTap').css('margin-top', scrollBody.height() + 70);
        $(window).resize(function(){
        $('.scrTap').css('margin-top', scrollBody.height() + 70);
    })

    fixTabLi.click(function(){
        $this = $(this);
        $tabs = $this.parent().next();

        $this.siblings().removeClass('on');
            $this.addClass('on');
    });
    $(window).scroll(function(){
        var fixTab = $('.tabScrTop');
        var fixTabLi = $('.tabScrTop > li'),
        scroll = $(window).scrollTop();
        scrollBody = $('.scrollBody').height() + 70;

        if (scroll >= scrollBody) fixTab.addClass('fixed');
        else fixTab.removeClass('fixed');

    })
}


//���̾��˾� ȣ��� ��ũ�� ��� 2021-03-11
function layer_scroll_lock(el){
    var $el = $(el);
    var posY = $(window).scrollTop();
    $el.css('display','flex');
    $('body').addClass('overHidden').on('scroll touchmove mousewheel', function(e){
        e.preventDefault();
     });
    $('.popup').css('top',-posY);
    $el.find('a.close, button.close').click(function(){
        $el.css('display','none');
        $('body').removeClass('overHidden').off('scroll touchmove mousewheel');
        posY = $(window).scrollTop(posY);
        return false;
    });
}