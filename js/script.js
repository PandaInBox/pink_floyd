$(document).ready(function(){
	var id_song, song, i, mute = false, volume =1,
	songs =[
	muz_one = [0,'Another Brick In The Wall (Part 1)', 'song/PF-ATBR-Pr1.mp3', '189.521575'],
	muz_two = [1,'Another Brick In The Wall (Part 2)', 'song/PF-ATBR-Pr2.mp3', '313.756735'],
	muz_three = [2,'Another Brick In The Wall (Part 3)', 'song/PF-ATBR-Pr3.mp3', '77.351756'],
	muz_four = [3,'The Trial', 'song/PF-TheTrial.mp3', '319.4411'],
	];
	// узнать время песни
	// song = new Audio(songs[0][2]);
	// song.addEventListener('loadedmetadata', function(){
	// 	console.log(this.duration);
	// });

	for (i=0; i<songs.length; i++){
		$('.wrapper_player').append('<div class="song" id="'+songs[i][0]+'"><div class="paly_pause_song"></div><div class="name_song_song">'+songs[i][1]+'</div><div class="duration_song">'+parseInt(songs[i][3]/60)+':'+parseInt(songs[i][3]%60)+'</div></div>');
	}
	function playnewsong(id){
		var curtime, cur = -100;
			$('.player .name_song').text(songs[id][1]);
			$('.paly_pause').attr('id',id);
			id_song = id;
			song = new Audio(songs[id][2]);
			$('.paly_pause').css({'background-image': 'url(img/pause.png)'});
			$('.song#'+id+' .paly_pause_song').css({'background-image': 'url(img/pause.png)'});
			song.play();
			song.volume = volume;
			song.addEventListener('timeupdate', function(){
				curtime = song.currentTime;
				cur = -((songs[id_song][3]-curtime)*100)/songs[id_song][3];
				$('.time').text(parseInt(curtime/60)+':'+parseInt(curtime%60));
				$('.progress').css({'left':cur+'%'});
			});
			song.addEventListener('progress', function(){
				var load = song.buffered.end(0);
				load = -((songs[id_song][3]-load)*100)/songs[id_song][3];
				$('.load').css({'left':load+'%'});
			});
	}
	//пауза и воспроизведение в плейлсте + смена иконок паузы-плея
	function playpausesong(id){
		if (song) {
			if (id == id_song){
				if (song.paused){
					song.play();
					song.volume = volume;
					$('.paly_pause').css({'background-image': 'url(img/pause.png)'});
					$('.song#'+id+' .paly_pause_song').css({'background-image': 'url(img/pause.png)'});
				}
				else{
					song.pause();
					$('.paly_pause').css({'background-image': 'url(img/playpause.png)'});
					$('.song#'+id+' .paly_pause_song').css({'background-image': 'url(img/playpause.png)'});
				}
			}
			else{
				song.pause();
				$('.paly_pause_song').css({'background-image': 'url(img/playpause.png)'});
				$('.song#'+id+' .paly_pause_song').css({'background-image': 'url(img/playpause.png)'});
				playnewsong(id);				
			}
		}
		else{
			playnewsong(id);
		}
	}
	//переключение уже включенных песен спомощью кнопочек
	$('.song, .paly_pause').on('click', function(){
		var
		id = $(this).attr('id');
		$('.paly_pause_song').css({'background-image': 'url(img/playpause.png)'});
		playpausesong(id);
		id++;
		$('.nextbtn#next_treck').attr('data-id',id);
		id--;id--;
		$('.nextbtn#last_treck').attr('data-id',id);
	});
	$('.nextbtn').on('click', function(){
		var id = $(this).attr('data-id');
		if (id != -1) {
			$('.paly_pause_song').css({'background-image': 'url(img/playpause.png)'});
			playpausesong(id);
			id++;
			$('.nextbtn#next_treck').attr('data-id',id);
			id--;id--;
			$('.nextbtn#last_treck').attr('data-id',id);
		}
	});
	$('.mute').on('click', function(){
		var preValue = volume.value;
		if (song) {
			if (mute == false) {
				mute = true;
				$('.mute').css({'color':'#c0392b'});
				$('.volume').val(0);
			}
			else{
				mute = false;
				$('.mute').css({'color':'#ecf0f1'});
				$('.volume').val(preValue);
			}
		song.muted = mute;
		}
	});
	//изменение громкости
	$('.volume').on("input", function(){
		var
		val = $(this).val();
		if (song) {
			volume = val/100;
			song.volume = volume;
			if (val == 0) {
				mute = true;
				$('.mute').css({'color':'#c0392b'});
			}
			else if (val > 0) {
				$('.mute').css({'color':'#ecf0f1'});
			}
		}
	});
	$('.range').on('mouseenter', function(){
		if (song) {
			var id = $('.paly_pause').attr('id'),
			offset = $(this).offset(),
			dur = songs[id][3],
			w = $(this).width();
			$('.setTime').show();
			$('.range').on('mousemove', function(e){
				var x = e.pageX - offset.left,
				xproc = (x*100)/w,
				sec = (xproc*dur)/100;
				$('.setTime').css({'left':x-10});
				$('.setTime').text(parseInt(sec/60)+':'+parseInt(sec%60));
				$('.range').on('click', function(){
					xproc = xproc-100;
					$('.progress').css({'left':xproc+'%'});
					song.currentTime = sec;
				});
			});
		}
	});
	$('.range').on('mouseout', function(){
		$('.setTime').hide();
	});
});