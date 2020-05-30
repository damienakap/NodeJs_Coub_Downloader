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

Quick Setup:
<ul>
 (Windows)
 <li>open setup.bat (a shortcut is also created)</li>
 <li>open run.bat</li>
 <li>type "setFfmpegPath" and enter the directory of ffmpeg.exe</li>
 <li>type "setFfprobePath" and enter the directory of ffprobe.exe</li>
 <li>type "saveSettings"</li>
</ul>

Setup:
<ul>
 <li>install nodejs  (https://nodejs.org/)</li>
 <li>install ffmpeg  (https://ffmpeg.org/)</li>
 <li>install ffprobe (https://ffmpeg.org/)</li>
 <li>go to downloader directory in terminal/powershell ( cd PATH/NodeJs_Coub_Downloader-master )</li>
 <li>run npm i (or run setup.bat)</li>
 <li>setup ffprobe and ffmpeg directories</li>
 <li>option 1:</li>
 <li><ul>
  <li>go to downloader directory ( cd PATH/NodeJs_Coub_Downloader-master )</li>
  <li>run coubDownloader.js ( npm coubDownloader.js )</li>
 </ul></li>
 <li>option 2:</li>
 <li><ul>
  <li>open run.bat</li>
 </ul></li>
 <li>With the coub downloader running:</li>
 <li><ul>
  <li>type "setFfmpegPath" and enter the directory of ffmpeg.exe</li>
  <li>type "setFfprobePath" and enter the directory of ffprobe.exe</li>
  <li>type "saveSettings"</li>
 </ul></li>
</ul>
 
      
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
        
Commands:
<pre>
   exit                Exit Coub Video Downloader
   setMode             Set download mode
       mode:0          Limit by max loops
       mode:1          Limit by audio duration
   setMaxLoops         Set the max video loops
   overrideMaxLoops    (enable/disable) Override absolute max loops
   reset               Reset settings to default.
   setDownloadFolder   Set folder the save downloaded videos to.
   setTempFolder       Set folder for temporary files.
   setFfmpegPath       Set the path to ffmpeg.exe
   setFfprobePath      Set the path to ffprobe.exe
   resetFilePaths      Reset all file paths.
   saveSettings        Save all setting values.
</pre>

Defaul File Paths:
<pre>
   Download Folder:    ./downloads
   Temp Folder:        ./tmp
   ffmpeg Path:        ./ffmpeg.exe
   ffprob Path:        ./ffprobe.exe
</pre>







