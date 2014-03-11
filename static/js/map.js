var tmp;

function play(id){
    var video = $("#video-"+id.toString());
    $("#video-wrap").show();
    video.css({position: "relative",
	       top:"100px",
	       margin:"0 auto",
	       width:"700px"
	      })
	.show();
    
};

function play_close(id){
    var video=$("#video-"+id.toString()).hide();
    var tmp =video.html();
    video.html('');
    video.html(tmp);
    $("#video-wrap").hide();
  
};

function fn_back(){
    $('.preview').hide();
    $('.preview-content').html('');
    if(rovar.currentPoint){
	rovar.currentPoint.setIcon(rovar.currentPoint._baseIcon);
	rovar.currentPoint._icon.onclick = rovar.currentPoint._onclick;
    }
    if(rovar.currentLine){
	rovar.currentLine.setStyle({'opacity':0.5});
	rovar.map.removeLayer(rovar.currentLine._pointA);
	rovar.map.removeLayer(rovar.currentLine._pointB);
    }
	
    $('#back-to-banner').hide();
    $('#type').hide();
    $('#banner').show();
    
    var stateObj = { foo: "bar" };
    history.pushState(stateObj, "page", '/');	  

    $('.leaflet-marker-icon').css({'margin-left': (-rovar._iconsize*rovar._kLeft).toString()+'px',
				   'margin-top': (-rovar._iconsize).toString()+'px',
				   'width': rovar._iconsize.toString()+'px',
				   'height': rovar._iconsize.toString()+'px'
				  });

    
};

var rovar = {
    elements:{},
    _iconSize: 36,
    _kLeft: 0.317,

    init : function(){
	//$('#map').height($(document).height());
	var map = new L.Map('map');
	var self = this;
	map.on('zoomend', function(ev){
		   self._iconsize = 36 * ev.target._zoom * ev.target._zoom / (12 * 12);
		   //console.log(ev.target._zoom, self._iconsize);
		   $('.leaflet-marker-icon').css({'margin-left': (-self._iconsize*self._kLeft).toString()+'px',
						  'margin-top': (-self._iconsize).toString()+'px',
						  'width': self._iconsize.toString()+'px',
						  'height': self._iconsize.toString()+'px'
						 });
	       });
	var minsk = new L.LatLng(53.9, 27.566667);
	this.copyright = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
	this.map = map.setView(minsk, 12);
	L.tileLayer('http://onbike.by/map/tile/{z}/{x}/{y}.png',
	//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	//http://tile.stamen.com/toner-lite/6/36/21.png
	//L.tileLayer('http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
		    {attribution: this.copyright,key: 'BC9A493B41014CAABB98F0471D759707'}).addTo(this.map);
    },

    addTrack : function (data){
	function show_preview(data, track){
	    //console.log(rovar.elements['t']);
	    //for(var i=rovar.elements[data.type[0]][data.type[1]].length-1; i>=0; i-- )
	    //	rovar.elements[data.type[0]][data.type[1]][i].setStyle({'opacity':0.5});
	    $('#banner').hide();
	    $('#back-to-banner').show();
        $('#type').show();
	    if(rovar.currentPoint){
		rovar.currentPoint.setIcon(rovar.currentPoint._baseIcon);
		if(rovar.currentPoint._icon)
		    rovar.currentPoint._icon.onclick = rovar.currentPoint._onclick;
	    }

	    if(rovar.currentLine){
		rovar.currentLine.setStyle({'opacity':0.5});
		rovar.map.removeLayer(rovar.currentLine._pointA);
		rovar.map.removeLayer(rovar.currentLine._pointB);
	    }
		
	    rovar.currentLine = track;
	    rovar.currentLine._pointA.addTo(rovar.map);
	    rovar.currentLine._pointB.addTo(rovar.map);

	    track.setStyle({'opacity':1});
	    rovar.map.removeLayer(rovar.currentLine);
	    rovar.currentLine.addTo(rovar.map);
	    var preview = $('.preview-content').html('')
		.append($("<h1>"+data.title+"</h1>").css('color', data.color));
	    if(data.duration)
		preview.append($("<p></p>").html('Время в пути: '+data.duration).addClass('description-address'));
	    if(data.video!=''){
		var video = $(data.video);
		preview.append(video);
		//if(preview.width()<preview.find('iframe').width())	    
	    }
	    var description;
	    if(data.post_url)
		description = "<p><a href=\""+data.post_url+"\">"+data.description+"</a></p>";
	    else
		description = "<p>"+data.description+"</p>";
	    preview.append(description);
	    preview.parent().show();
	    if(typeof video != 'undefined'){
		video.height(video.height()*(preview.width())/video.width());
		video.width(preview.width());
	    }
	    
	    var stateObj = { foo: "bar" };
	    history.pushState(stateObj, "page", '/'+ data.uid +'/');	  

	    if(typeof DISQUS != 'undefined'){
		DISQUS.reset({
				 reload: true,
				 config: function () {  
				     this.page.identifier = data.uid;  
				     this.page.title = data.title;
				     //console.log(this);
				     this.page.url = "http://onbike.by/"+data.uid+"/";
				 }
			     });
		$('#disqus_thread').show();
	    }

	    $('.leaflet-marker-icon').css({'margin-left': (-rovar._iconsize*rovar._kLeft).toString()+'px',
					   'margin-top': (-rovar._iconsize).toString()+'px',
					   'width': rovar._iconsize.toString()+'px',
					   'height': rovar._iconsize.toString()+'px'
					  });
	    
	}
	/*var video='', btn='';
	if(data.video!=''){
	    video=$("<div id=\"video-"+data.id.toString()+"\">"+
		    data.video+
		    "</div>")
		.addClass("video");
	    video.prepend("<a href=\"javascript:play_close("+
			  data.id.toString()+
			  ")\" class=\"close\">X</a><br/>");
	    video.hide().appendTo('#video-wrap');
	    btn = "<a href=\"javascript:play("+
		data.id.toString()+
		")\">Смотреть видео</a>";
	}
	var description;
	if(data.post_url)
	    description = "<p><a href=\""+data.post_url+"\">"+data.description+"</a></p>";
	else
	    description = "<p>"+data.description+"</p>";
	   
	polyline.addTo(this.map).bindPopup("<h1>"+data.title+"</h1>"+
					   description+
					   btn
					   );
	*/
	var polyline = L.polyline(data.route, {color: data.color});
	polyline.addTo(this.map);
	//polyline.onclick(function(){console.log('CLICK');});
	//tmp = polyline;
	polyline._container.onclick = function(){show_preview(data, polyline); };

	var myIconA =new L.Icon({
				    iconUrl: data.marker_a,
				    iconSize: [this._iconSize, this._iconSize],
				    iconAnchor: [this._iconSize*this._kLeft, this._iconSize]
			       });
	
	var myIconB =new L.Icon({
				    iconUrl: data.marker_b,
				    iconSize: [this._iconSize, this._iconSize],
				    iconAnchor: [this._iconSize*this._kLeft, this._iconSize]
				});
	
	var pointA = L.marker(data.route[0], {color: 'red', icon: myIconA});
	var pointB = L.marker(data.route[data.route.length-1], {color: 'red', icon: myIconB});

	//pointA.addTo(this.map);
	//pointB.addTo(this.map);
	pointA._onclick = function(){show_preview(data, polyline); };
	pointB._onclick = function(){show_preview(data, polyline); };
	
	//pointA._icon.onclick = function(){show_preview(data, polyline); };
	//pointB._icon.onclick = function(){show_preview(data, polyline); };
	polyline._pointA = pointA;
	polyline._pointB = pointB;

	polyline._container.onclick = function(){show_preview(data, polyline); };
	this.elements[data.type[0]][data.type[1]].push(polyline);
	
	if(rovar_uid == data.uid)
	    show_preview(data, polyline);
	//this.elements[data.type[0]][data.type[1]].push(pointA);
	//this.elements[data.type[0]][data.type[1]].push(pointB);
    },

    loadTrack : function(id){
	var self = this;
	$.ajax({
		   url: '/map/track/'+id+'/',
		   method: 'GET',
		   success: function(data){
		       self.addTrack(data);
		   }
	       });	
    },

    loadTracks : function(filter){
	var self = this;
	$.ajax({url: '/map/available-tracks/',
		method: 'GET',
		data: filter,
		success: function(data){
		    for(var i=0;i<data.ids.length;i++){
			self.loadTrack(data.ids[i]);
		    }
		}
	       });	
    },

    hide : function(layers){
	for(var i=layers.length-1; i>=0;i--){
	    this.map.removeLayer(layers[i]);
	    if(layers[i]._pointA){
		this.map.removeLayer(layers[i]._pointA);
		this.map.removeLayer(layers[i]._pointB);
	    }
	}
    },

    show : function(layers){
	for(var i=layers.length-1; i>=0;i--){
	    layers[i].addTo(this.map);
	    if(layers[i]._icon)
		layers[i]._icon.onclick = layers[i]._onclick;
	}

	$('.leaflet-marker-icon').css({'margin-left': (-this._iconsize*this._kLeft).toString()+'px',
				       'margin-top': (-this._iconsize).toString()+'px',
				       'width': this._iconsize.toString()+'px',
				       'height': this._iconsize.toString()+'px'
				      });
	
    },

    addPoint : function (data){
	//console.log(data.coordinates);
	if(data.status == 'success'){
	    function show_preview(data, _point){
		$('#banner').hide();
		$('#back-to-banner').show();
        $('#type').show();

		if(rovar.currentPoint){
		    rovar.currentPoint.setIcon(rovar.currentPoint._baseIcon);
		    if(rovar.currentPoint._icon)
			rovar.currentPoint._icon.onclick = rovar.currentPoint._onclick;
		}
		    
		rovar.currentPoint = _point;
		rovar.currentPoint.setIcon(rovar.currentPoint._activeIcon);
		$('.leaflet-marker-icon').css({'margin-left': (-rovar._iconsize*rovar._kLeft).toString()+'px',
					       'margin-top': (-rovar._iconsize).toString()+'px',
					       'width': rovar._iconsize.toString()+'px',
					       'height': rovar._iconsize.toString()+'px'
					      });

		rovar.currentPoint._icon.onclick = fn_back;//rovar.currentPoint._onclick;
		
		if(rovar.currentLine){
		    rovar.currentLine.setStyle({'opacity':0.5});
		    rovar.map.removeLayer(rovar.currentLine._pointA);
		    rovar.map.removeLayer(rovar.currentLine._pointB);
		}
		var description;
		if(data.post_url)
		    description = "<p><a href=\""+data.post_url+"\">"+data.description+"</a></p>";
		else
		    description = "<p>"+data.description+"</p>";
		var preview = $('.preview-content').html('')
		    .append($("<h1>"+data.title+"</h1>").css('color', data.color))
		    .append($("<p></p>").html(data.address).addClass('description-address'));
		//for(var i=data.images.length-1; i>=0; i--)
		if(data.images && data.images.length){
		    $('<img/>').attr({'src': data.images[0], 'title': "Show more..."}).appendTo(preview);
		}
		preview.append(description).parent().show();

		var stateObj = { foo: "bar" };
		history.pushState(stateObj, "page", '/'+ data.uid +'/');	  

		if(typeof DISQUS != 'undefined'){
		    
		    DISQUS.reset({
				     reload: true,
				     config: function () {  
					 this.page.identifier = data.uid;  
					 this.page.title = data.title;
					 this.page.url = "http://onbike.by/"+data.uid+"/";
					 console.log(this);
				     }
				 });
		    $('#disqus_thread').show();
		}	
	
	    }

	    var myIcon =new L.Icon({
				       iconUrl: data.marker,
				       iconSize: [this._iconSize, this._iconSize],
				       iconAnchor: [this._iconSize*this._kLeft, this._iconSize]
				   });

	    var activeIcon =new L.Icon({
				       iconUrl: data.marker_active,
				       iconSize: [this._iconSize, this._iconSize],
				       iconAnchor: [this._iconSize*this._kLeft, this._iconSize]
				   });

	    var point = L.marker(data.coordinates, {color: 'red', icon: myIcon});
	    point._baseIcon = myIcon;
	    point._activeIcon = activeIcon;
	    point.addTo(this.map);
	    point._onclick = function(){show_preview(data, point);};
	    
	    point._icon.onclick = function(){show_preview(data, point);};
	    //point._baseIcon.onclick = function(){show_preview(data, point);};
	    //point._activeIcon.onclick = function(){show_preview(data, point);};
	    //point.addTo(this.map).bindPopup("<h1>"+data.title+"</h1>"+
	    //				    description
	    //				   );
	    this.elements[data.type[0]][data.type[1]].push(point);
	    if(rovar_uid == data.uid)
		show_preview(data, point);
	}
    },

    loadPoints : function(filter){
	var self = this;
	$.ajax({url: '/map/available-points/',
		method: 'GET',
		data: filter,
		success: function(data){
		    for(var i=0;i<data.ids.length;i++){
			self.loadPoint(data.ids[i]);
		    }
		}
	       });	
    },
    
    loadPoint: function(id){
	var self = this;
	$.ajax({
		   url: '/map/point/'+id+'/',
		   method: 'GET',
		   success: function(data){
		       self.addPoint(data);
		   }
	       });	
    }

};

rovar.init();



$(function(){
      $('#back-to-banner').click(fn_back);

      var types = $(".type-all");
      for(var i = types.length-1; i>=0; i--){
	  var id = types[i].id.split('-');
	  if(id[1]=='p'){
	      rovar.loadPoints({type: id[2]});
	  }else if(id[1]=='t'){
	      rovar.loadTracks({type: id[2]});
	  }
	  if(typeof rovar.elements[id[1]] == "undefined"){
	      rovar.elements[id[1]]={};
	  }
	  rovar.elements[id[1]][id[2]]=[];    
	  
      }

	  
      types.click(function(){
		      var id = this.id.split('-');
		      if($(this).attr('class').indexOf('disable')>=0){
			  $(this).removeClass('disable');
			  rovar.show(rovar.elements[id[1]][id[2]]);
		      }
		      else{
			  $(this).addClass('disable');
			  rovar.hide(rovar.elements[id[1]][id[2]]);
		      }		      
		  }
		 );
});
