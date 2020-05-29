# NodeJs_Coub_Downloader
 A meh coub video downloader

Depdancies:
    Nodejs (npm):
        jquery
        https
        jsdom
        fluent-ffmpeg
        ffprobe
        ffprobe-static
    downloads:
        ffprobe.exe
        ffmpeg.exe
        
Usage:
 - run coubDownloader.js ( npm coubDownloader.js )
 - past the video url when prompted
 - type help for additional info

Note:
 - assumes you are using windows, but may be adapted for other platforms

features:
 - can set the output video length by loop count or audio duration
 - TODO: set video/audio quality (currently set to the highest available)
        
