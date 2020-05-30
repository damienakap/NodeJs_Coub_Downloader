# NodeJs_Coub_Downloader
 A meh coub video downloader.</br>
 Dowloads videos from https://coub.com/ </br>

Depdancies:</br>
<ul>
 NodeJs:
 <li>jquery</li>
 <li>https</li>
 <li>jsdom</li>
 <li>fluent-ffmpeg</li>
 <li>ffprobe</li>
 <li>ffprobe-static</li>
 </br>
 Downloads:
 <li>NodeJs</li>
 <li>ffprobe.exe</li>
 <li>fmpeg.exe</li>
</ul>

Setup:
 - install nodejs  (https://nodejs.org/)
 - install ffmpeg  (https://ffmpeg.org/)
 - install ffprobe (https://ffmpeg.org/)
 - go to downloader directory in terminal/powershell ( cd PATH/NodeJs_Coub_Downloader-master )
 - run npm i
      
Usage:
 - go to downloader directory ( cd PATH/NodeJs_Coub_Downloader-master )
 - run coubDownloader.js ( npm coubDownloader.js )
 - past the video url when prompted
 - type help for additional info

Note:
 - assumes you are using windows, but may be adapted for other platforms

features:
 - can set the output video length by loop count or audio duration
 - can set the search path of ffmpeg and ffprobe
 - can set the download location for videos
 - settings can be saved
 - TODO: set video/audio quality (currently set to the highest available)
 - TODO: option to keep the original video and audio files
 - TODO: option to download as gif
 - TODO: set audio offset (fix sync on some videos)
 - TODO: set output vidio offset (idk why not)
 - TODO: option to set speed of the video (fix desync over time)
 - TDOD: option to clip either end of the original video (fix desync over time) (for slow videos)
 - TODO: option to clip either end of the output video (fix slow to start and no end audio coubs)
        
