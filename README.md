# F-UI
常用组件开发包含弹窗、日期、幻灯片等效果

> 弹窗（modal）

集成常用弹窗功能，以及一些样式

#####基本参数：

 - title:''
标题设置，可以为你的弹窗设置一个标题，也可不填。
 - content:''（必填）
 弹窗的主要内容，可以是文字，可以是图片，也可以直接是html
 - style:''
 设置layer-content内容的样式
 - mask:[true/false]
 是否有遮罩层
 - FIndex:1
 当前弹窗的顺序，也就是弹窗的文档层次（z-index）
 - position:[0,1,2,3,4,5,6,7,8]
 弹窗位置设置，默认居中，0为居中，1-8的位置就是从左上到左中顺时针一圈的位置
 - time
 可以自己设置弹窗关闭的时间，单位是秒
 - fixedWidth:true
 这个是为了是否固定一个宽度给弹窗。因为如果是图片的话，才开始加载，可能不去设置宽度，设置（100%）的话，可能会存在一些问题，图片过于高等等（待修正）
 - cls:'name'
 可以为弹窗内容添加class 名称 然后自己去控制样式
 - btn:['确定','取消',...],
 按钮组，为你的弹窗添加一个或者多个按钮
 - btnFns:[fn1,fn2,...]
 函数组，添加一组函数，注意，这里的顺序和你按钮的顺序会一一对应的
 - success:fn
 默认加载完成后 执行的函数

#####基本用法：

    $("#btn").click(function(){
		F.modal({
			title:'历史',
			//fixedWidth:true,
			content:'<span onclick="a()">测试文字</span>',
			cls:'name',
			time:0,
			//position:5,
			//mask:false,
			style:'width:static;',
			//btn:['我知道了'],
			btnFns:[
				function(){
					//alert('确定');
				},
				function(){
					//alert('取消');
				}
			],//第二个函数
			success:function(obj){
				setTimeout(function(){
					//obj.close();
				},5000);
				//alert('加载成功');
			}//加载成功函数
		});
	});


> 日期（date）

集成一些常用的日期选择功能，节假日图标、节假日剔除、周末剔除等等

#####基本参数：

 - ele:'#ID'
 你要初始化日历的触发元素，我建议用ID选择器
 - event:''
 元素的触发的事件，默认是点击
 - format:'yyyy-mm-dd'
 回显的日期格式
 - minDate:'2014-12-10'
 设置一个最小的日期，默认是1900-01-01 00:00:00
 - maxDate:'2016-12-10'
 设置一个最大的日期，默认是2999-12-12 00:00:00
 - time:true
 日历面板是否显示时分秒选择框
 - today:true
 面板是否显示今天按钮
 - iconHoliday:true
 是否显示节假日图标（默认否）
 - legal:true,
 是否除去节假日，包含周末，但是因为每年的节假日都不一样，所以需要自己手动录入，今年的节假日
 - disables:[{start:'2016-12-31',end:'2017-1-2'},{},{},...]
 今年或者其他年份的放假时间。格式：{start:'2016-12-31',end:'2017-1-2'}
 - allows:[‘2017-04-01’，...]
 周末调休的时间。格式：2017-04-01
 - selected:fn 
 选择好日期的时候会触发的函数

##### 基本用法：

    F.date({
		ele:'#data1',
		event:'click',//事件
		format:'yyyy年MM月dd日 hh:mm:ss',
		//minDate:F.date.now(-1),
		//maxDate:F.date.now(+1),
		legal:true,
		iconHoliday:true,
		disables:[{start:'2016-12-31',end:'2017-1-2'},
				  {start:'2017-1-27',end:'2017-2-2'},
				  {start:'2017-4-2',end:'2017-4-4'},
				  {start:'2017-4-29',end:'2017-5-1'},
				  {start:'2017-5-28',end:'2017-5-30'},
				  {start:'2017-5-28',end:'2017-5-30'},
				  {start:'2017-10-1',end:'2017-10-8'}],
		allows:['2017-1-22','2017-2-4','2017-4-1','2017-5-27','2017-9-30'],
		time:true,
		today:true,
		selectedFn:function(selectedTime){
			//alert(new Date(selectedTime).Format('yyyy-MM-dd'));
		}
	});