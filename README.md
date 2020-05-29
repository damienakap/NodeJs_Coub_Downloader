# NodeJs_Coub_Downloader
 A meh coub video downloader

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

        
Usage:
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
 - TODO: set audio offset to fix sync on some videos
        
