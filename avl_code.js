
function NODE(val=null,obj=null)
{
		this.value=val;		//val is the value of the node,i.e the key it stores
		this.parent=null;	//parent is uded to point to the parents node,it is null if the node is root
		this.height=null;	//height is the height of the tree
		this.left=null;		//left is used to point to the left child
		this.right=null;   //right is used to point to the right child
		this.json={			//json is an object
				name:this.value,
				direction:null, //to indicate which node of the parent it is,i.e left or right
				children:[]
		};
		this.obj=obj;


		this.set_height=function(){
				var left_height=0;
				var right_height=0;
				this.json.children=[];
				if(this.left)
				{
					left_height=this.left.height;
					this.json.children.push(this.left.json);//the left child becomes a part of the array
					this.left.json.direction="left"; //to indicate that it is a left node of its parent node
				}

				if(this.right)
				{
					right_height=this.right.height;
					this.json.children.push(this.right.json);//the left child becomes a part of the array
					this.right.json.direction="right"; //to indicate that it is a left node of its parent node
				}
				if(left_height>right_height)
					this.height=1+left_height;
				else
					this.height=1+right_height;
			}

		this.bal_fac=function(){
			var left_height=0;var right_height=0;
			if(this.left)
				left_height=this.left.height;
			if(this.right)
				right_height=this.right.height;
			return left_height-right_height;			
		}

	}			//end of function NODE


function BST_AVL(){
	this.root=null;

	this.rotate_right=function(z)
	{
		var left1=z.left;
		var left_r=null;
		if(left1)
			left_r=left1.right;
		if(left_r)
			left_r.parent=z;
		left1.right=z;
		z.left=left_r;

		left1.parent=z.parent;
		z.parent=left1;

		z.set_height();
		left1.set_height();
		if(z==this.root)
			this.root=left1;
		return left1;

	}

	this.rotate_left=function(z)
	{
		var right1=z.right;
		var right_l=null; //represents the left child of the right node of z
		if(right1)
			right_l=right1.left;
		if(right_l)
			right_l.parent=z;
		right1.left=z;
		right1.parent=z.parent;
		z.right=right_l;
		z.parent=right1;

		z.set_height();
		right1.set_height();

		if(z==this.root)
			this.root=right1;
		return right1;
	}


	this.balance=function(cur)
	{
		if(cur.bal_fac()==2)
		{
			if(cur.left.bal_fac()==-1) //need to perform LR rotation
			{
					cur.left=this.rotate_left(cur.left);
					sleep(2000);

			}
			cur=this.rotate_right(cur);
		}

		if(cur.bal_fac()==-2)
		{
			if(cur.right.bal_fac()==1)
				cur.right=this.rotate_right(cur.right);
			cur=this.rotate_left(cur);
		}

		return cur;
	}

	this.search=function(val,cur=this.root)
	{
		if(cur==null)
			return -1;
		if(cur.value==val)
			return cur;
		else if(cur.value<val)
			return this.search(val,cur.right);
		else
			return this.search(val,cur.left);
	}

	this.insert=function(cur,val,obj){
		if(cur==null)
			cur=new NODE(val,obj);
		else if(val<=cur.value)
		{
			cur.left=this.insert(cur.left,val,obj);
			cur.left.parent=cur;

			cur.left.json.direction="left";
			cur.json.children.push(cur.left.json);
		}
		else
		{

			cur.right=this.insert(cur.right,val,obj);
			cur.right.parent=cur;

			cur.right.json.direction="right";
			cur.json.children.push(cur.right.json);
		}

		cur.set_height();
		cur=this.balance(cur);
		return cur;
	}

	this.Insert_val=function(val,obj)
	{
		this.root=this.insert(this.root,val,obj);
	}

	this.delete_val=function(val)
	{
		var node=this.search(val);
		if(node==-1)
			return;
		this.delete(node);

		if(this.root)
			this.root=this.balance(this.root);
	}

	this.delete=function(cur){
	if (cur.parent == null && cur.right == null && cur.left == null) {
		
			this.root = null;
			return;
		}

		if (cur.right == null) {
		
			if (cur.parent == null) {
				cur = cur.left;
				cur.parent = null;
			}

			else if (cur.parent.left == cur)
				cur.parent.left = cur.left;
			else
				cur.parent.right = cur.left;
			if (cur.left)
				cur.left.parent = cur.parent;

		} else if (cur.left == null) {
			
			if (cur.parent == null) {
				cur = cur.right;
				cur.parent = null;
			}

			else if (cur.parent.left == cur)
				cur.parent.left = cur.right;
			else
				cur.parent.right = cur.right;
			if (cur.right)
				cur.right.parent = cur.parent;

		} else {
		var prev, temp = cur;
			temp = cur.left;
			prev = cur;
			while (temp.right != null) {
				prev = temp;
				temp = temp.right;
			}
			cur.value = temp.value;
			cur.json.name = cur.value;
			if (prev == cur)
				prev.left = temp.left;
			else
				prev.right = temp.left;

			prev.set_height();
			prev = this.balance(prev);
			while (prev.parent) {
				prev = prev.parent;
				prev.set_height();
				prev = this.balance(prev);
			}
			return;
		}

		while (cur.parent) {
			cur.set_height();
			cur = this.balance(cur);
			cur = cur.parent;
		}
		cur.set_height();
		this.root = this.balance(cur);
	}

	this.inorder = function(cur = this.root) {
		var numbers = [];
		if (cur != null) {
			numbers = this.inorder(cur.left);
			numbers.push(cur.value);
			numbers = numbers.concat(this.inorder(cur.right));
		}
		return numbers;
	}

	this.preorder = function(cur = this.root) {
		var numbers = [];
		if (cur != null) {
			numbers = [cur.value];
			numbers = numbers.concat(this.preorder(cur.left));
			numbers = numbers.concat(this.preorder(cur.right));
		}
		return numbers;
	}

	this.postorder = function(cur = this.root) {
		var numbers = [];
		if (cur != null) {
			numbers = numbers.concat(this.postorder(cur.left));
			numbers = numbers.concat(this.postorder(cur.right));
			numbers.push(cur.value);
		}
		return numbers;
	}

	}

var bst=new BST_AVL();


function sleep(delay)
{
	var start=new Date().getTime();
	while(new Date().getTime<start+delay);
}

var textBox = document.getElementById('value');
var msg = document.getElementById('msg');
var textName=document.getElementById('name');
var textSRN=document.getElementById('SRN');
var textAge=document.getElementById('Age');

textName.setAttribute("class","invisible");
textSRN.setAttribute("class","invisible");
textAge.setAttribute("class","invisible");


function disp()
{
	textName.setAttribute("class","visible form-control");
	textSRN.setAttribute("class","visible form-control");
	textAge.setAttribute("class","visible form-control");
}

function hide()
{

textName.setAttribute("class","invisible");
textSRN.setAttribute("class","invisible");
textAge.setAttribute("class","invisible");
}

function InsertNode() {
	
	if(textBox.value=='')
		return;
	var val = Number(textBox.value);
	var obj={
		name1:textName.value,
		SRN:textSRN.value,
		Age:textAge.value
	};
	bst.Insert_val(val,obj);
	textBox.value = '';
	msg.innerHTML = '';
	textAge.value='';
	textName.value='';
	textSRN.value='';
	textBox.focus();
	drawTree();
	textName.setAttribute("class","invisible");
	textSRN.setAttribute("class","invisible");
	textAge.setAttribute("class","invisible");
}

function DeleteNode() {
	if (textBox.value == '') 
		return;
	var val = Number(textBox.value);
	bst.delete_val(val);
	textBox.value = '';
	drawTree();
	
	msg.innerHTML = '';
	textBox.focus();
}

function SearchNode() {
	if (textBox.value != '') {
		var val = Number(textBox.value);
		var node = bst.search(val);
		if (node == -1)
			msg.innerHTML = 'not found';
		else
			msg.innerHTML = 'Name: '+ node.obj.name1+ '  SRN:'+node.obj.SRN+'  Age:'+node.obj.Age;
	}
	textBox.value = '';
	textBox.focus();
}

function print_bal_factor()
{
	if (textBox.value != '') {
		var val = Number(textBox.value);
		var node = bst.search(val);
		if (node == -1)
			msg.innerHTML = 'not found';
		else
			msg.innerHTML ="The balance Factor of the node entered is "+node.bal_fac();
	}
	textBox.value = '';
	textBox.focus();
}


function Print(traversal) {
	var numbers = traversal.call(bst);
	msg.innerHTML = numbers.join(', ');
	textBox.focus();
}


function drawTree() {

	d3.select("svg").remove();
	var treeData;
	if (bst.root)
		treeData = bst.root.json;
	else
		return;
	var margin = {
			top: 50,
			right: 90,
			bottom: 50,
			left: 90
		},
		width = window.innerWidth - 10 - margin.left - margin.right,
		height = window.innerHeight - 45 - margin.top - margin.bottom;

	var treemap = d3.tree()
		.size([width, height]);

	var nodes = d3.hierarchy(treeData);

	nodes = treemap(nodes);


	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom),
		g = svg.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	var link = g.selectAll(".link")
		.data(nodes.descendants().slice(1))
		.enter().append("path")
		.attr("class", "link")
		.attr("d", function(d) {
			
			if (d.parent && d.parent.children.length == 1) {
				if (d.data.direction == 'right') {
					if (d.parent.parent)
						d.x += Math.abs(d.parent.x - d.parent.parent.x) / 2;
					else
						d.x += width / 4;
				} else {
					if (d.parent.parent)
						d.x -= Math.abs(d.parent.x - d.parent.parent.x) / 2;
					else
						d.x -= width / 4;
				}
			}

			return "M" + d.x + "," + d.y +
				"C" + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 +
				" " + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 +
				" " + d.parent.x + "," + d.parent.y;
		});

	
	var node = g.selectAll(".node")
		.data(nodes.descendants())
		.enter().append("g")
		.attr("class", function(d) {
			return "node" +
				(d.children ? " node--internal" : " node--leaf");
		})
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	node.append("circle")
		.attr("r", 15);

	node.append("text")
		.attr("dy", ".35em")
		.attr("y", function(d) {
			return 0;
		})
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.name;
		});
}









		