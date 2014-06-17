$(function(){
	(function(){

		return {

			ctx: null,

			tile_size: 0,

			offset: 20,

			scale: 0,

			size: 600,

			piece_size: 54,

			factor: 0,

			init: function(){
				if(!!document.createElement("canvas").getContext){
					var chess_div = $("div.chessdiv");

					if(chess_div.length){
						this.factor = (1 - (this.scale / 100));

						this.size = (this.factor * this.size);
						this.piece_size = (this.factor * this.piece_size);

						this.build_canvas();
						this.build_snapshot_button();
					}
				}
			},

			build_snapshot_button: function(){
				var img = $("<img src='http://example.com/images/snapshot.png' alt='Take Snapshot' title='Take Snapshot' />").css("cursor", "pointer");

				img.click($.proxy(this.create_snapshot, this));

				// Does switcheroo exist or trashcan?

				if($("#switcheroo").length){
					$("#switcheroo").parent().append(img);
				} else if($("#trashcan").length){
					$("#trashcan").parent().append(img);
				}
			},

			build_canvas: function(){
				var canvas = $("<canvas width='" + this.size + "' height='" + this.size + "' id='chesscanvas' style=''></canvas>");
				var wrapper = $("<div id='chesssnapshotwrapper' style='text-align: center;'></div>").hide();

				wrapper.append(canvas);
				$("body").append(wrapper);

				this.ctx = canvas.get(0).getContext("2d");
				this.offset = (this.factor * 20);
				this.tile_size = (this.size - this.offset - (this.factor * 2.5)) / 8;
			},

			build_board: function(){
				this.ctx.beginPath();
				this.ctx.fillStyle = "#888";
				this.ctx.fillRect(0, 0, this.size, this.size);

				this.ctx.beginPath();
				this.ctx.fillStyle = "#DDD";
				this.ctx.fillRect(this.offset, -this.offset, this.size, this.size);

				this.ctx.beginPath();
				this.ctx.rect(0, 0, this.size, this.size);
				this.ctx.lineWidth = (this.factor * 5);
				this.ctx.strokeStyle = "#00000";
				this.ctx.stroke();

				this.ctx.beginPath();
				this.ctx.fillStyle = "#BBBBFF";

				for(var r = 0; r < 8; r ++){
					for(var c = 0; c < 8; c += 2){
						inc = 0;

						if(r % 2 == 0){
							inc = 1;
						}

						this.ctx.fillRect((r * this.tile_size) + this.offset, ((c + inc) * this.tile_size) + (this.factor * 2.5), this.tile_size, this.tile_size);
					}
				}

				var font_size = (this.factor * 10);

				this.ctx.beginPath();
				this.ctx.fillStyle = "#fff";
				this.ctx.font = font_size + "px Verdana";

				var num = 8;
				var char_code_start = 65;

				for(var n = 1; n <= 8; n ++){
					this.ctx.fillText(num --, (this.factor * 8),  (this.tile_size * n) - (this.tile_size / 2) + (this.factor * 5));
					this.ctx.fillText(String.fromCharCode(char_code_start ++).toLowerCase(), (this.tile_size * n) - (this.tile_size / 2) + this.offset, (this.tile_size * 8) + this.offset / 2 + (this.factor * 3));
				}
			},

			clear_canvas: function(){
				this.ctx.clearRect(0, 0, this.size, this.size);
				this.build_board();
			},

			create_snapshot: function(){
				var pieces = $("div.chessdiv img.chessPiece");
				var self = this;

				self.build_board();

				pieces.each(function(){
					var img = new Image();
					var id = $(this).parent().attr("id");
			  		var r = parseInt(id.substr(1)) - 1;
					var c = id.toUpperCase().charCodeAt(0) - 65;

			  		img.src = $(this).attr("src");

			  		img.onload = function(){
			  			var x_off = (self.factor * 2.5);
			  			var y_off = (self.piece_size + (self.offset / 2)) - (self.factor * 2.5);

			  			var x = (self.tile_size * c) + (self.piece_size / 2) + x_off;
			  			var y = (self.tile_size * 8) - (self.tile_size * r) - y_off;

			   			self.ctx.drawImage(img, x, y, self.piece_size, self.piece_size);
					};
				});

				$("#chesssnapshotwrapper").dialog({
					modal: true,
					height: (self.size + 120),
					width: (self.size + 50),
					resizable: false,
					draggable: false,
					title: "Chess Snapshot",

					buttons: {

						Close: function(){
							self.clear_canvas();
							$(this).dialog("close");
						}

					}
				});

			}

		};

	})().init();

});