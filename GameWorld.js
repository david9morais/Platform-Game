var GameWorld = Class.extend(function(){
  this.x=0;
  this.y=0;
  this.width= 0;
  this.height= 0;
  
 
  this.constructor= function(x,y,w,h){
	  if(x!=undefined && y!=undefined && w!= undefined && h!= undefined)  this.setup(x,y,w,h);
  };
  
  this.setup=function(x,y,w,h){
	this.x=x;
	this.y=y;
	this.width= w;
	this.height= h; 
  }
});


