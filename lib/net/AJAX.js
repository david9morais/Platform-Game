var AJAX = Class.extend(function(){
	this.constructor= function(){};

	this.request = function(url,method,mimeType,async,callback){
						var xhr;   
						xhr= new XMLHttpRequest();
						
						// o overrideMimeType é necessário para evitar o warning  do firefox
						// ao carregar ficheiros json
						if (xhr.overrideMimeType) xhr.overrideMimeType(mimeType);	
						
						xhr.open(method,url,async);
						xhr.setRequestHeader("Content-type",mimeType);
						xhr.onload=function(){callback(xhr);};
						xhr.send(null);
					}
});