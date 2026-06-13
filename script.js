(function(){
    var script = {
 "scrollBarColor": "#000000",
 "scripts": {
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "existsKey": function(key){  return key in window; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getKey": function(key){  return window[key]; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "unregisterKey": function(key){  delete window[key]; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "registerKey": function(key, value){  window[key] = value; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); }
 },
 "paddingBottom": 0,
 "borderRadius": 0,
 "backgroundPreloadEnabled": true,
 "id": "rootPlayer",
 "buttonToggleMute": "this.Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C",
 "desktopMipmappingEnabled": false,
 "contentOpaque": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "defaultVRPointer": "laser",
 "width": "100%",
 "definitions": [{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 42",
 "id": "panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_t.jpg",
 "overlays": [
  "this.overlay_CFA5EB55_C19A_6CED_41B9_7BC3365A622B"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 156.88,
   "backwardYaw": 132.25,
   "panorama": "this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -175.95,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE6D9ECE_C1FE_25FF_41C9_4F7089785BC3",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -47.75,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF139DF9_C1FE_27A5_41A7_7B99BC88AF37",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -4.94,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CEA1EE8A_C1FE_2467_41D5_8F912FD670DF",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 48",
 "id": "panorama_70A093F0_63F7_8A5B_41D2_100E519CA066",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_t.jpg",
 "overlays": [
  "this.overlay_7E344252_6419_8A5C_41D7_F4C1CD164E50"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -90.07,
   "backwardYaw": 4.05,
   "panorama": "this.panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "hfovMax": 130,
 "label": "INT_Scene 44",
 "id": "panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_t.jpg",
 "overlays": [
  "this.overlay_CFAADEAC_C19A_25A3_41DE_DC928217834C",
  "this.overlay_CFAA3EAC_C19A_25A3_41D6_75550AD14D49",
  "this.overlay_CFAA0EAC_C19A_25A3_4182_F41E666345F2",
  "this.overlay_CFAA6EAC_C19A_25A3_41C0_028C7BFECA34"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -6.14,
   "backwardYaw": -90.76,
   "panorama": "this.panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -79.13,
   "backwardYaw": 2.1,
   "panorama": "this.panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -176.75,
   "backwardYaw": 13.6,
   "panorama": "this.panorama_70709924_63F7_87FB_41D2_A6762FCAA418",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 73.87,
   "backwardYaw": 82.55,
   "panorama": "this.panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "hfovMax": 130,
 "label": "INT_Scene 43",
 "id": "panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_t.jpg",
 "overlays": [
  "this.overlay_CFA7B55C_C19A_E4E2_41C7_1E397234B0CF",
  "this.overlay_CFA7D55C_C19A_E4E2_41CD_2CFE15A8E308"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -15.72,
   "backwardYaw": 88.66,
   "panorama": "this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 2.1,
   "backwardYaw": -79.13,
   "panorama": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C",
   "camera": "this.panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320",
   "camera": "this.panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE",
   "camera": "this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1",
   "camera": "this.panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007",
   "camera": "this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903",
   "camera": "this.panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371",
   "camera": "this.panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
   "camera": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D",
   "camera": "this.panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8",
   "camera": "this.panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD",
   "camera": "this.panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_70A093F0_63F7_8A5B_41D2_100E519CA066",
   "camera": "this.panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_70709924_63F7_87FB_41D2_A6762FCAA418",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_70709924_63F7_87FB_41D2_A6762FCAA418_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 164.28,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE43BEB3_C1FE_25A5_41E3_749ED0F62A11",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -14.44,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF686DD0_C1FE_27E3_41E0_9BF3B8C79568",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -73.63,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE2E0EF1_C1FE_25A5_41C6_8397F7110F96",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 45",
 "id": "panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_t.jpg",
 "overlays": [
  "this.overlay_CF95C78A_C19A_6467_41CE_4CDA2C913B96",
  "this.overlay_CF95E78A_C19A_6467_41DF_EB0C07E4A431"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -90.76,
   "backwardYaw": -6.14,
   "panorama": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_70709924_63F7_87FB_41D2_A6762FCAA418",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_70709924_63F7_87FB_41D2_A6762FCAA418_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 178.62,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF76BDDA_C1FE_27E7_41E5_EB53AD60A26F",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -97.45,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE974E72_C1FE_24A6_41DE_D06571DD28BA",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "EXTScene 37",
 "id": "panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_t.jpg",
 "overlays": [
  "this.overlay_CE3135BE_C19E_279F_41C8_7A1441871231",
  "this.overlay_CE3125BE_C19E_279F_41BD_87EE9B63142B"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 95.06,
   "backwardYaw": 165.56,
   "panorama": "this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 175.06,
   "backwardYaw": -1.38,
   "panorama": "this.panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 97.52,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE7D6ED7_C1FE_25ED_41DF_D0F8E91BC403",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "buttonToggleHotspots": "this.Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration",
 "buttonToggleGyroscope": "this.Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12",
 "gyroscopeEnabled": true,
 "class": "PanoramaPlayer",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "touchControlMode": "drag_rotation"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 157.01,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE5DFEC6_C1FE_25EF_41D0_8449F7756EF2",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 121.8,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE0F8EE0_C1FE_25A3_41DE_7A941EA1AA1A",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 125.94,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF7F5DE3_C1FE_27A5_41E7_6ED3D1C25857",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -106.13,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE1FFEE8_C1FE_25A3_41E7_CE3DC590D014",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 46",
 "id": "panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_t.jpg",
 "overlays": [
  "this.overlay_CFA6D675_C19A_24AD_41DD_A11746BC437F",
  "this.overlay_CFA6B675_C19A_24AD_41D5_C37A4DDD4DD3"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 82.55,
   "backwardYaw": 73.87,
   "panorama": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 25.97,
   "backwardYaw": 106.37,
   "panorama": "this.panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 3.25,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF38EE16_C1FE_246F_41CC_276C5244F97C",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 39",
 "id": "panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_t.jpg",
 "overlays": [
  "this.overlay_CF9B21B7_C19E_3FAE_41E3_556EFBC2153C",
  "this.overlay_CF9B11B7_C19E_3FAE_41D3_38536C49D06E",
  "this.overlay_CF9AD1B7_C19E_3FAE_41DF_EEAA61FC666C",
  "this.overlay_CF9AC1B8_C19E_3FA3_41DB_2AB69BFF0DD8"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 88.66,
   "backwardYaw": -15.72,
   "panorama": "this.panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 165.56,
   "backwardYaw": 95.06,
   "panorama": "this.panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -82.48,
   "backwardYaw": -22.99,
   "panorama": "this.panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 89.24,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CEEA1E34_C1FE_24A3_41D9_CB683527B787",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -166.4,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE878E59_C1FE_24E2_41DB_ED3295B8ADAE",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -154.03,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CEDA5E2A_C1FE_24A7_41E5_C761BC777EFF",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 49",
 "id": "panorama_70709924_63F7_87FB_41D2_A6762FCAA418",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_t.jpg",
 "overlays": [
  "this.overlay_7E787EFD_641A_BA45_41D3_7AC80C29961D"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 13.6,
   "backwardYaw": -176.75,
   "panorama": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 47",
 "id": "panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_t.jpg",
 "overlays": [
  "this.overlay_CC6E77EE_C187_E3BF_41D5_4183234AC226",
  "this.overlay_CC6E87EE_C187_E3BF_41B7_B258E33569D0",
  "this.overlay_CC6EB7EE_C187_E3BF_41BC_79D7669855BB"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": 4.05,
   "backwardYaw": -90.07,
   "panorama": "this.panorama_70A093F0_63F7_8A5B_41D2_100E519CA066",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 106.37,
   "backwardYaw": 25.97,
   "panorama": "this.panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -177.9,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CEF40E3E_C1FE_249F_41E4_7BD420625B9F",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "EXTScene 36_2",
 "id": "panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_t.jpg",
 "overlays": [
  "this.overlay_CCA06F0E_C19E_247F_41DB_AA60C1AA3EB5"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -1.38,
   "backwardYaw": 175.06,
   "panorama": "this.panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 173.86,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CEB16E9E_C1FE_259F_41D3_316C6482A24F",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -23.12,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF0A2DEE_C1FE_27BF_41D3_0CFFB1139385",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "audio": {
  "mp3Url": "media/audio_452A03E2_640A_8A7F_41A1_498266839AF5.mp3",
  "class": "AudioResource",
  "oggUrl": "media/audio_452A03E2_640A_8A7F_41A1_498266839AF5.ogg"
 },
 "class": "MediaAudio",
 "autoplay": true,
 "id": "audio_452A03E2_640A_8A7F_41A1_498266839AF5",
 "data": {
  "label": "Ambaseel"
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -84.94,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CE53BEBC_C1FE_25A3_41E1_7A81C619AAA1",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "displayOriginPosition": {
  "class": "RotationalCameraDisplayPosition",
  "stereographicFactor": 1,
  "yaw": 0,
  "pitch": -90,
  "hfov": 165
 },
 "displayMovements": [
  {
   "duration": 1000,
   "easing": "linear",
   "class": "TargetRotationalCameraDisplayMovement"
  },
  {
   "targetPitch": 0,
   "targetStereographicFactor": 0,
   "duration": 3000,
   "easing": "cubic_in_out",
   "class": "TargetRotationalCameraDisplayMovement"
  }
 ],
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_camera",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 40",
 "id": "panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_t.jpg",
 "overlays": [
  "this.overlay_CC4CDF3E_C199_E49E_41D2_B2C4B7D3D017",
  "this.overlay_CC4CFF3E_C199_E49E_41DA_094A7B739574"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -22.99,
   "backwardYaw": -82.48,
   "panorama": "this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": -54.06,
   "backwardYaw": -58.2,
   "panorama": "this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 89.93,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CEC84E20_C1FE_24A3_41A4_B178ECA7A667",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": 100.87,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF2EFE0C_C1FE_2463_41C9_4423952C78F2",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "initialPosition": {
  "yaw": -91.34,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "id": "camera_CF1F4E03_C1FE_2465_41E0_18E4C4F59486",
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera"
},
{
 "hfovMax": 130,
 "label": "INT_Scene 41",
 "id": "panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007",
 "vfov": 180,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/f/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/u/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/r/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/b/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/d/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "rowCount": 3,
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "rowCount": 2,
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_0/l/2/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "rowCount": 1,
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama",
 "thumbnailUrl": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_t.jpg",
 "overlays": [
  "this.overlay_CF832E34_C19A_24A3_41E4_0825E8EC4702",
  "this.overlay_CF830E34_C19A_24A3_41C3_1275207AC33C"
 ],
 "adjacentPanoramas": [
  {
   "distance": 1,
   "yaw": -58.2,
   "backwardYaw": -54.06,
   "panorama": "this.panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1",
   "class": "AdjacentPanorama"
  },
  {
   "distance": 1,
   "yaw": 132.25,
   "backwardYaw": 156.88,
   "panorama": "this.panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903",
   "class": "AdjacentPanorama"
  }
 ],
 "hfov": 360,
 "hfovMin": "150%",
 "partial": false
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "iconURL": "skin/Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C.png",
 "id": "Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C",
 "gap": 5,
 "pressedIconHeight": 30,
 "width": 60,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Arial",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#F7931E"
 ],
 "borderColor": "#000000",
 "layout": "horizontal",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 60,
 "fontSize": 12,
 "pressedIconURL": "skin/Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C_pressed.png",
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "class": "Button",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button Settings Mute"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 30,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "pressedIconWidth": 30
},
{
 "toolTipDisplayTime": 600,
 "paddingBottom": 0,
 "borderRadius": 0,
 "id": "MainViewer",
 "transitionMode": "blending",
 "toolTipShadowColor": "#333333",
 "progressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "vrPointerSelectionColor": "#FF6600",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBottom": 5,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadow": true,
 "playbackBarHeadHeight": 15,
 "toolTipBorderColor": "#767676",
 "vrPointerSelectionTime": 2000,
 "progressBorderColor": "#000000",
 "toolTipBorderSize": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarOpacity": 1,
 "height": "100%",
 "firstTransitionDuration": 0,
 "progressBottom": 0,
 "toolTipTextShadowBlurRadius": 3,
 "class": "ViewerArea",
 "progressBackgroundOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowColor": "#000000",
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "progressLeft": 0,
 "paddingRight": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadWidth": 6,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "toolTipFontColor": "#606060",
 "paddingTop": 0,
 "progressBarBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipShadowSpread": 0,
 "minHeight": 50,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderSize": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "shadow": false,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowColor": "#000000",
 "minWidth": 100,
 "toolTipFontStyle": "normal",
 "toolTipShadowVerticalLength": 0,
 "toolTipShadowBlurRadius": 3,
 "progressRight": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "propagateClick": false,
 "data": {
  "name": "Main Viewer"
 },
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "layout": "vertical",
 "width": 60,
 "contentOpaque": false,
 "id": "Container_E034C9BB_C1CB_F8AA_41DD_388A86F3EE00",
 "paddingRight": 0,
 "right": 23,
 "verticalAlign": "middle",
 "children": [
  "this.Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4",
  "this.Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12",
  "this.Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C",
  "this.Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09",
  "this.Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2"
 ],
 "scrollBarMargin": 2,
 "top": "1.47%",
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#F7931E"
 ],
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "height": 300,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorRatios": [
  0.02
 ],
 "class": "Container",
 "shadow": false,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-button set"
 },
 "horizontalAlign": "center",
 "overflow": "scroll",
 "propagateClick": false,
 "gap": 0
},
{
 "paddingBottom": 0,
 "borderRadius": 0,
 "left": "0.83%",
 "id": "Image_41B9FBEB_640B_9A4D_41D3_7CEAC7F97D20",
 "paddingRight": 0,
 "width": "9.487%",
 "verticalAlign": "middle",
 "url": "skin/Image_41B9FBEB_640B_9A4D_41D3_7CEAC7F97D20.png",
 "maxWidth": 1095,
 "maxHeight": 1095,
 "top": "0%",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "height": "13.805%",
 "minHeight": 1,
 "class": "Image",
 "click": "this.openLink('https://www.instagram.com/nedf_studios/', '_blank')",
 "shadow": false,
 "minWidth": 1,
 "data": {
  "name": "Image21448"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "scaleMode": "fit_inside",
 "cursor": "hand"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "iconURL": "skin/Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4.png",
 "id": "Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4",
 "width": 60,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Arial",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#F7931E"
 ],
 "borderColor": "#000000",
 "layout": "horizontal",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 60,
 "fontSize": 12,
 "pressedIconURL": "skin/Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4_pressed.png",
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "class": "Button",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button settings VR"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 30,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "gap": 5
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "iconURL": "skin/Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2.png",
 "id": "Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2",
 "gap": 5,
 "pressedIconHeight": 30,
 "width": 60,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Arial",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "backgroundColorDirection": "vertical",
 "backgroundColor": [
  "#F7931E"
 ],
 "borderColor": "#000000",
 "layout": "horizontal",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 60,
 "fontSize": 12,
 "pressedIconURL": "skin/Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2_pressed.png",
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "class": "Button",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button Settings Fullscreen"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 30,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "pressedIconWidth": 30
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.43,
   "yaw": 156.88,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.49,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007, this.camera_CF139DF9_C1FE_27A5_41A7_7B99BC88AF37); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BC9A01_C1FA_2C65_41E5_715701D0D5FC",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 156.88,
   "pitch": -23.49,
   "distance": 100,
   "hfov": 6.43
  }
 ],
 "id": "overlay_CFA5EB55_C19A_6CED_41B9_7BC3365A622B",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.3,
   "yaw": -90.07,
   "image": {
    "levels": [
     {
      "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.15,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD, this.camera_CE6D9ECE_C1FE_25FF_41C9_4F7089785BC3); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_7F07E4EF_641B_8E45_41AF_6F9272849012",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -90.07,
   "pitch": -6.15,
   "distance": 100,
   "hfov": 6.3
  }
 ],
 "id": "overlay_7E344252_6419_8A5C_41D7_F4C1CD164E50",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.06,
   "yaw": -79.13,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.26,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371, this.camera_CEF40E3E_C1FE_249F_41E4_7BD420625B9F); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BD9A02_C1FA_2C67_41D4_92E3F882476A",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -79.13,
   "pitch": -30.26,
   "distance": 100,
   "hfov": 6.06
  }
 ],
 "id": "overlay_CFAADEAC_C19A_25A3_41DE_DC928217834C",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.54,
   "yaw": -6.14,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.24,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D, this.camera_CEEA1E34_C1FE_24A3_41D9_CB683527B787); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BE2A02_C1FA_2C67_41B7_81BCB166ECE1",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -6.14,
   "pitch": -21.24,
   "distance": 100,
   "hfov": 6.54
  }
 ],
 "id": "overlay_CFAA3EAC_C19A_25A3_41D6_75550AD14D49",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.33,
   "yaw": 73.87,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.32,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8, this.camera_CE974E72_C1FE_24A6_41DE_D06571DD28BA); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BEFA02_C1FA_2C67_41DD_64BFC544F637",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 73.87,
   "pitch": 1.32,
   "distance": 100,
   "hfov": 6.33
  }
 ],
 "id": "overlay_CFAA0EAC_C19A_25A3_4182_F41E666345F2",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.33,
   "yaw": -176.75,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.05,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_70709924_63F7_87FB_41D2_A6762FCAA418, this.camera_CE878E59_C1FE_24E2_41DB_ED3295B8ADAE); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BDEA02_C1FA_2C67_41E0_0DB416F9FDBF",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -176.75,
   "pitch": 3.05,
   "distance": 100,
   "hfov": 6.33
  }
 ],
 "id": "overlay_CFAA6EAC_C19A_25A3_41C0_028C7BFECA34",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 5.92,
   "yaw": -15.72,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.43,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE, this.camera_CF1F4E03_C1FE_2465_41E0_18E4C4F59486); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BD3A02_C1FA_2C67_41DA_2FAD0BA4971B",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -15.72,
   "pitch": -32.43,
   "distance": 100,
   "hfov": 5.92
  }
 ],
 "id": "overlay_CFA7B55C_C19A_E4E2_41C7_1E397234B0CF",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.98,
   "yaw": 2.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2, this.camera_CF2EFE0C_C1FE_2463_41C9_4423952C78F2); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BDDA02_C1FA_2C67_41DD_845C81E7C2E9",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 2.1,
   "pitch": 6,
   "distance": 100,
   "hfov": 6.98
  }
 ],
 "id": "overlay_CFA7D55C_C19A_E4E2_41CD_2CFE15A8E308",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.53,
   "yaw": -90.76,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.4,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2, this.camera_CEB16E9E_C1FE_259F_41D3_316C6482A24F); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BDAA03_C1FA_2C65_41E4_36EA193C6672",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -90.76,
   "pitch": -21.4,
   "distance": 100,
   "hfov": 6.53
  }
 ],
 "id": "overlay_CF95C78A_C19A_6467_41CE_4CDA2C913B96",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.34,
   "yaw": -91.46,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BE2A03_C1FA_2C65_41A6_8A2C8B478DC1",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -91.46,
   "pitch": 0.76,
   "distance": 100,
   "hfov": 6.34
  }
 ],
 "id": "overlay_CF95E78A_C19A_6467_41DF_EB0C07E4A431",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 8.2,
   "yaw": 175.06,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.12,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C, this.camera_CF76BDDA_C1FE_27E7_41E5_EB53AD60A26F); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1B9A9F9_C1FA_2FA5_416E_18B5A6E966FD",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 175.06,
   "pitch": -9.12,
   "distance": 100,
   "hfov": 8.2
  }
 ],
 "id": "overlay_CE3135BE_C19E_279F_41C8_7A1441871231",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.25,
   "yaw": 95.06,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.3,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE, this.camera_CF686DD0_C1FE_27E3_41E0_9BF3B8C79568); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BA69F9_C1FA_2FA5_41E0_AECE4C0EEFD9",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 95.06,
   "pitch": 9.3,
   "distance": 100,
   "hfov": 6.25
  }
 ],
 "id": "overlay_CE3125BE_C19E_279F_41BD_87EE9B63142B",
 "enabledInCardboard": true
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "iconURL": "skin/Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09.png",
 "id": "Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09",
 "gap": 5,
 "pressedIconHeight": 30,
 "width": 60,
 "rollOverIconHeight": 30,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Arial",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "backgroundColorDirection": "vertical",
 "rollOverIconWidth": 30,
 "backgroundColor": [
  "#F7931E"
 ],
 "borderColor": "#000000",
 "layout": "horizontal",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 60,
 "fontSize": 12,
 "pressedIconURL": "skin/Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09_pressed.png",
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "class": "Button",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button Settings HS"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 30,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "pressedIconWidth": 30
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "borderRadius": 0,
 "iconURL": "skin/Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12.png",
 "id": "Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12",
 "gap": 5,
 "pressedIconHeight": 30,
 "width": 60,
 "rollOverIconHeight": 30,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 1,
 "iconBeforeLabel": true,
 "fontFamily": "Arial",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "backgroundColorDirection": "vertical",
 "rollOverIconWidth": 30,
 "backgroundColor": [
  "#F7931E"
 ],
 "borderColor": "#000000",
 "layout": "horizontal",
 "borderSize": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "mode": "toggle",
 "paddingLeft": 0,
 "height": 60,
 "fontSize": 12,
 "pressedIconURL": "skin/Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12_pressed.png",
 "minHeight": 1,
 "backgroundColorRatios": [
  0
 ],
 "class": "Button",
 "shadowSpread": 1,
 "fontStyle": "normal",
 "shadow": false,
 "minWidth": 1,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button Settings Gyro"
 },
 "horizontalAlign": "center",
 "propagateClick": false,
 "fontWeight": "normal",
 "iconWidth": 30,
 "shadowBlurRadius": 6,
 "cursor": "hand",
 "pressedIconWidth": 30
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.73,
   "yaw": 25.97,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.36,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD, this.camera_CE2E0EF1_C1FE_25A5_41C6_8397F7110F96); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BEFA03_C1FA_2C65_41E6_16F7D0E3E739",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 25.97,
   "pitch": -16.36,
   "distance": 100,
   "hfov": 6.73
  }
 ],
 "id": "overlay_CFA6D675_C19A_24AD_41DD_A11746BC437F",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.33,
   "yaw": 82.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.32,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2, this.camera_CE1FFEE8_C1FE_25A3_41E7_CE3DC590D014); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BE9A04_C1FA_2C62_41E4_3661C87AA556",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 82.55,
   "pitch": 1.32,
   "distance": 100,
   "hfov": 6.33
  }
 ],
 "id": "overlay_CFA6B675_C19A_24AD_41D5_C37A4DDD4DD3",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.33,
   "yaw": 165.56,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 2.71,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320, this.camera_CE53BEBC_C1FE_25A3_41E1_7A81C619AAA1); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BA39FA_C1FA_2FA7_41D8_33B5838829F3",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 165.56,
   "pitch": 2.71,
   "distance": 100,
   "hfov": 6.33
  }
 ],
 "id": "overlay_CF9B21B7_C19E_3FAE_41E3_556EFBC2153C",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.11,
   "yaw": -82.48,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.26,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1, this.camera_CE5DFEC6_C1FE_25EF_41D0_8449F7756EF2); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BAD9FA_C1FA_2FA7_41E7_CBF564C19ABD",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -82.48,
   "pitch": -16.26,
   "distance": 100,
   "hfov": 6.11
  }
 ],
 "id": "overlay_CF9B11B7_C19E_3FAE_41D3_38536C49D06E",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.58,
   "yaw": -33.45,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_2_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.36,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BB49FA_C1FA_2FA7_41D1_55111C07ED1D",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -33.45,
   "pitch": -20.36,
   "distance": 100,
   "hfov": 6.58
  }
 ],
 "id": "overlay_CF9AD1B7_C19E_3FAE_41DF_EEAA61FC666C",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.97,
   "yaw": 88.66,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_3_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.52,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371, this.camera_CE43BEB3_C1FE_25A5_41E3_749ED0F62A11); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BB09FB_C1FA_2FA5_41E0_C93AA5489FF9",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 88.66,
   "pitch": 6.52,
   "distance": 100,
   "hfov": 6.97
  }
 ],
 "id": "overlay_CF9AC1B8_C19E_3FA3_41DB_2AB69BFF0DD8",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.34,
   "yaw": 13.6,
   "image": {
    "levels": [
     {
      "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.1,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2, this.camera_CF38EE16_C1FE_246F_41CC_276C5244F97C); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_7F0784EF_641B_8E45_41C1_C72449E4FECF",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 13.6,
   "pitch": 0.1,
   "distance": 100,
   "hfov": 6.34
  }
 ],
 "id": "overlay_7E787EFD_641A_BA45_41D3_7AC80C29961D",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.34,
   "yaw": 4.05,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_1_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.8,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_70A093F0_63F7_8A5B_41D2_100E519CA066, this.camera_CEC84E20_C1FE_24A3_41A4_B178ECA7A667); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BF5A04_C1FA_2C62_41DB_6B9E0AD60C89",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 4.05,
   "pitch": 0.8,
   "distance": 100,
   "hfov": 6.34
  }
 ],
 "id": "overlay_CC6E77EE_C187_E3BF_41D5_4183234AC226",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Door 01"
 },
 "maps": [
  {
   "hfov": 6.33,
   "yaw": 65.18,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.32,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BFFA04_C1FA_2C62_41C9_DCE9CDA9B465",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 65.18,
   "pitch": 1.32,
   "distance": 100,
   "hfov": 6.33
  }
 ],
 "id": "overlay_CC6E87EE_C187_E3BF_41B7_B258E33569D0",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.38,
   "yaw": 106.37,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_1_HS_2_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.52,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8, this.camera_CEDA5E2A_C1FE_24A7_41E5_C761BC777EFF); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1406A04_C1FA_2C62_41D7_35EE0C9E811A",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 106.37,
   "pitch": -24.52,
   "distance": 100,
   "hfov": 6.38
  }
 ],
 "id": "overlay_CC6EB7EE_C187_E3BF_41BC_79D7669855BB",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 8.23,
   "yaw": -1.38,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.73,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320, this.camera_CEA1EE8A_C1FE_2467_41D5_8F912FD670DF); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1B959F6_C1FA_2FAF_41DA_80CDB809180F",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -1.38,
   "pitch": -7.73,
   "distance": 100,
   "hfov": 8.23
  }
 ],
 "id": "overlay_CCA06F0E_C19E_247F_41DB_AA60C1AA3EB5",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.66,
   "yaw": -22.99,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.37,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE, this.camera_CE7D6ED7_C1FE_25ED_41DF_D0F8E91BC403); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BBD9FB_C1FA_2FA5_41D6_FCAD9C2C2CE9",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -22.99,
   "pitch": -18.37,
   "distance": 100,
   "hfov": 6.66
  }
 ],
 "id": "overlay_CC4CDF3E_C199_E49E_41D2_B2C4B7D3D017",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.84,
   "yaw": -54.06,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007, this.camera_CE0F8EE0_C1FE_25A3_41DE_7A941EA1AA1A); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BC69FB_C1FA_2FA5_41E7_B708D8605F76",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -54.06,
   "pitch": -12.72,
   "distance": 100,
   "hfov": 6.84
  }
 ],
 "id": "overlay_CC4CFF3E_C199_E49E_41DA_094A7B739574",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 6.74,
   "yaw": -58.2,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_1_HS_0_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1, this.camera_CF7F5DE3_C1FE_27A5_41E7_6ED3D1C25857); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BC19FB_C1FA_2FA5_41DC_296C774EC69F",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -58.2,
   "pitch": -16.06,
   "distance": 100,
   "hfov": 6.74
  }
 ],
 "id": "overlay_CF832E34_C19A_24A3_41E4_0825E8EC4702",
 "enabledInCardboard": true
},
{
 "rollOverDisplay": false,
 "data": {
  "label": "Circle Point 01b"
 },
 "maps": [
  {
   "hfov": 5.55,
   "yaw": 132.25,
   "image": {
    "levels": [
     {
      "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -37.69,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903, this.camera_CF0A2DEE_C1FE_27BF_41D3_0CFFB1139385); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_D1BCCA01_C1FA_2C65_41B7_7362CD84D5F6",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 132.25,
   "pitch": -37.69,
   "distance": 100,
   "hfov": 5.55
  }
 ],
 "id": "overlay_CF830E34_C19A_24A3_41C3_1275207AC33C",
 "enabledInCardboard": true
},
{
 "levels": [
  {
   "url": "media/panorama_CFA5FB55_C19A_6CED_41BF_2DD6CA860903_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BC9A01_C1FA_2C65_41E5_715701D0D5FC",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_70A093F0_63F7_8A5B_41D2_100E519CA066_0_HS_0_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_7F07E4EF_641B_8E45_41AF_6F9272849012",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BD9A02_C1FA_2C67_41D4_92E3F882476A",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_1_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BE2A02_C1FA_2C67_41B7_81BCB166ECE1",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_2_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BEFA02_C1FA_2C67_41DD_64BFC544F637",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFAACEAB_C19A_25A5_41E6_9CFB9D0AADA2_1_HS_3_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BDEA02_C1FA_2C67_41E0_0DB416F9FDBF",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BD3A02_C1FA_2C67_41DA_2FAD0BA4971B",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFA7855C_C19A_E4E2_41D0_215C52D42371_1_HS_1_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BDDA02_C1FA_2C67_41DD_845C81E7C2E9",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BDAA03_C1FA_2C65_41E4_36EA193C6672",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF95D78A_C19A_6467_41E4_3729ABCA1B2D_1_HS_1_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BE2A03_C1FA_2C65_41A6_8A2C8B478DC1",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1B9A9F9_C1FA_2FA5_416E_18B5A6E966FD",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CE31C5BE_C19E_279F_41AD_124E81BF2320_1_HS_1_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BA69F9_C1FA_2FA5_41E0_AECE4C0EEFD9",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BEFA03_C1FA_2C65_41E6_16F7D0E3E739",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CFA6F675_C19A_24AD_41DC_F89EACA495F8_1_HS_1_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BE9A04_C1FA_2C62_41E4_3661C87AA556",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_0_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BA39FA_C1FA_2FA7_41D8_33B5838829F3",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_1_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BAD9FA_C1FA_2FA7_41E7_CBF564C19ABD",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_2_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BB49FA_C1FA_2FA7_41D1_55111C07ED1D",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF9B31B7_C19E_3FAE_41CD_787BF778E0CE_1_HS_3_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BB09FB_C1FA_2FA5_41E0_C93AA5489FF9",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_70709924_63F7_87FB_41D2_A6762FCAA418_0_HS_0_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_7F0784EF_641B_8E45_41C1_C72449E4FECF",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_1_HS_0_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BF5A04_C1FA_2C62_41DB_6B9E0AD60C89",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_1_HS_1_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 24,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BFFA04_C1FA_2C62_41C9_DCE9CDA9B465",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CC6E57EE_C187_E3BF_41E6_0FBD57F431FD_1_HS_2_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1406A04_C1FA_2C62_41D7_35EE0C9E811A",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CCA1FF0D_C19E_247D_41E6_D26B8C05DA4C_1_HS_1_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1B959F6_C1FA_2FAF_41DA_80CDB809180F",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BBD9FB_C1FA_2FA5_41D6_FCAD9C2C2CE9",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CC4CCF38_C199_E4A3_41C7_028D7A736CF1_1_HS_1_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BC69FB_C1FA_2FA5_41E7_B708D8605F76",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_1_HS_0_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BC19FB_C1FA_2FA5_41DC_296C774EC69F",
 "colCount": 4
},
{
 "levels": [
  {
   "url": "media/panorama_CF833E34_C19A_24A3_41E6_E4A135A9A007_1_HS_1_0.png",
   "width": 1000,
   "height": 660,
   "class": "ImageResourceLevel"
  }
 ],
 "frameCount": 22,
 "frameDuration": 41,
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_D1BCCA01_C1FA_2C65_41B7_7362CD84D5F6",
 "colCount": 4
}],
 "start": "this.playAudioList([this.audio_452A03E2_640A_8A7F_41A1_498266839AF5]); this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12], 'gyroscopeAvailable'); if(!this.get('fullscreenAvailable')) { [this.Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4,this.Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2].forEach(function(component) { component.set('visible', false); }) }",
 "layout": "absolute",
 "children": [
  "this.MainViewer",
  "this.Container_E034C9BB_C1CB_F8AA_41DD_388A86F3EE00",
  "this.Image_41B9FBEB_640B_9A4D_41D3_7CEAC7F97D20"
 ],
 "height": "100%",
 "scrollBarMargin": 2,
 "vrPolyfillScale": 1,
 "scrollBarWidth": 10,
 "mobileMipmappingEnabled": false,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingTop": 0,
 "paddingLeft": 0,
 "minHeight": 20,
 "buttonToggleFullscreen": [
  "this.Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4",
  "this.Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2"
 ],
 "class": "Player",
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "downloadEnabled": false,
 "minWidth": 20,
 "data": {
  "name": "Player446"
 },
 "horizontalAlign": "left",
 "overflow": "visible",
 "propagateClick": false,
 "mouseWheelEnabled": true,
 "gap": 10
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
