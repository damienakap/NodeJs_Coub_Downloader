

/*
Email: damienakap@gmail.com
last updated: 05/29/2020

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

*/



const https         = require('https');
const jsdom         = require('jsdom');

const fs            = require('fs');
const readline      = require('readline');

const fluent_ffmpeg = require("fluent-ffmpeg")
const ffprobe       = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

const defaultFfprobePath    = "./ffprobe.exe";
const defaultFfmpegPath     = "./ffmpeg.exe";

var ffprobePath         = "./ffprobe.exe";
var ffmpegPath          = "./ffmpeg.exe";

fluent_ffmpeg.setFfprobePath(ffprobePath);
fluent_ffmpeg.setFfmpegPath(ffmpegPath);

var outputFolder            = "./downloads";
var tmpFolder               = "./tmp";

const defaultOutputFolder   = "./downloads";
const defaultTmpFolder      = "./tmp";


const absoluteMaxLoops = 60;
const defaultMaxLoops = 30;
var maxLoops = 30;

var limitMode = 0;
var overrideMaxLoops = false;


function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

async function processCoubVideo(json, videoLink, audioLink)
{

    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log( "Video Link: " + videoLink );
    console.log(" ");
    console.log( "Audio Link: " + audioLink );
    console.log(" ");
    console.log(" ");

    var videoName = json.title
        .split(" ").join("_")
        .split("\\").join("_")
        .split("/").join("_")
        .split("?").join("")
        .split("|").join("-")
        .split("%").join("")
        .split(":").join("-")
        .split("\'").join("")
        .split("\"").join("_")
        .split("\*").join("")
        ;
    videoName  = cleanString(videoName);
    //videoName.replace(/[/\\?%*:|"<>]/g, '-')
    
    var permaLink = json.permalink;


    var videoExtention = ".mp4";
    var audioExtention = ".mp3";

    var rawOutputVideoName = videoName +"_coub_"+ permaLink + "_video";
    var rawOutputAudioName = videoName +"_coub_"+ permaLink + "_audio";



    await saveLinkToFile( videoLink, rawOutputVideoName + videoExtention );
    await saveLinkToFile( audioLink, rawOutputAudioName + audioExtention );

    //await sleep(1000);

    console.log(" ");
    console.log(" ");
    var videoInfo = await getMediaDuration( rawOutputVideoName + videoExtention );
    var audioInfo = await getMediaDuration( rawOutputAudioName + audioExtention );

    console.log(" ");
    console.log(" ");
    console.log("Video Duration: "      + videoInfo.duration);
    console.log("Video codec: "         + videoInfo.codec_name);
    console.log("Video frame rate: "    + eval(videoInfo.avg_frame_rate) );
    console.log("Audio Duration: "      + audioInfo.duration);
    console.log(" ");
    console.log(" ");

    var videoLoops = Math.ceil(audioInfo.duration/videoInfo.duration);
    
    maxLoops = Math.max(maxLoops,1);
    if( !overrideMaxLoops)
    {
        maxLoops    = Math.min(maxLoops,absoluteMaxLoops);
        videoLoops  = Math.min(videoLoops,absoluteMaxLoops);
    }

    if(limitMode==0)
    {
        videoLoops = Math.min( videoLoops, maxLoops);
    }
    

    console.log("Number of Video Loops: " + videoLoops );
    

    var outputVideoName = videoName + "_coub_" + permaLink;

    console.log(" ");
    console.log(" ");
    console.log("Looping Video...");
    await loopVideo(
        rawOutputVideoName + videoExtention, 
        outputVideoName + videoExtention,
        videoLoops
        );
    console.log("Looping Video Done!");
    
    console.log(" ");
    console.log(" ");
    console.log("Attatching Audio...");

    var dur = Math.min( audioInfo.duration, videoInfo.duration * videoLoops);

    await attatchAudio(
        outputVideoName + videoExtention,
        rawOutputAudioName + audioExtention,
        dur
        );
    console.log("Attatching Audio Done!");
    
    console.log(" ");
    console.log(" ");
    console.log("Removing Temp Files...");

    try {
        // remove raw audiofile
        var tempPath = tmpFolder+'/'+ rawOutputAudioName + audioExtention;
        if(fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.log("...Removed Audio File...");

        // remove raw video
        tempPath = tmpFolder+'/'+ rawOutputVideoName + videoExtention;
        if(fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.log("...Removed Raw Video File...");

        // remove looped video
        tempPath = tmpFolder+'/tmp_'+ outputVideoName + videoExtention;
        if(fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.log("...Removed Looped Video File...");


        console.log("Removing Temp Files Done!");
    } catch (e) {
        console.log("Error "+e.code +": "+e.msg);
    }

    console.log(" ");
    console.log(" ");
    console.log("Download Comlete!");
    alertTerminal();
    downloadComplete = true;

}


async function parseHtml(page)
{
    const {JSDOM} = jsdom;
    const dom = new JSDOM(page);
    const $ = (require('jquery'))(dom.window);
    
    var body = $("#embed-data-json").html();
    while(body == undefined){ await sleep(1000) }

    // get json data
    //var json = $("#embed-data-json").html();

    // Get json data (incomplete json data fix)
    var in1 = body.indexOf("file_versions") - 1;
    var in2 = body.indexOf("audio_versions") - 1;
    var json = body.substring(in1+16, in2-1);
    
    json = $.parseJSON(json);

    body = removeWhiteSpace(body);

    in1 = body.indexOf("permalink")-1;
    in2 = body.indexOf("title") - 1;
    json.permalink = body.substring(in1+13, in2-2);

    in1 = body.indexOf("visibility_type")-1;
    json.title = body.substring(in2+9, in1-2);

    //console.log(json.title);

    
    
        


    var jsonVideo = json.html5.video;
    var jsonAudio = json.html5.audio;

    //console.log("Json: " + JSON.stringify(jsonVideo) );

    var videoLink = "";
    if(jsonVideo.hasOwnProperty('higher')){
        videoLink = jsonVideo.higher.url;
    } else if(jsonVideo.hasOwnProperty('high')) {
        videoLink = jsonVideo.high.url;
    } else if(jsonVideo.hasOwnProperty('med')) {
        videoLink = jsonVideo.med.url
    } else {
        console.error("No Video Was Found");
        return;
    }

    var audioLink = "";
    if(jsonAudio.hasOwnProperty('higher')){
        audioLink = jsonAudio.higher.url;
    } else if(jsonAudio.hasOwnProperty('high')) {
        audioLink = jsonAudio.high.url;
    } else if(jsonAudio.hasOwnProperty('med')) {
        audioLink = jsonAudio.med.url
    } else {
        console.error("No Audio Was Found");
        return;
    }

    //console.log(json);
    await processCoubVideo(json, videoLink, audioLink);
    
}



async function attatchAudio(outputFileName, audioFileName, duration)
{
    //console.log(" ");
    try {
        var temp = 0.0;
        return new Promise(function(resolve, reject) {
            new fluent_ffmpeg(tmpFolder+'/tmp_'+ outputFileName)
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                printProgress("Processing: 100%");
                console.log('\n\n');
                console.log("Saved File: " + outputFileName );
                resolve(1);
            })
            .on('progress', function(progress) {
                //console.log();
                temp = progress.percent;
                temp = Math.max(0.0,temp).toFixed(2);
                printProgress('Processing: ' + temp + '%');
            })
            .addInput( tmpFolder+"/"+ audioFileName)
            .setDuration(duration)
            .saveToFile(outputFolder+"/"+outputFileName, "./");
        
        });

    } catch (e) {
        console.log("Error "+e.code +": "+e.msg);
    }
}

async function loopVideo( fileName, outputFileName, loops )
{

    try {
        var ffmpegCommand = new fluent_ffmpeg(tmpFolder+'/'+ fileName);
        ffmpegCommand.setMaxListeners(loops+4);

        console.log("Added Loop Video: (1/"+loops+")");

        for( i=1; i<loops; i++ )
        {
            ffmpegCommand
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                
            })
            .mergeAdd(tmpFolder+'/'+ fileName);
            console.log("Added Loop Video: (" +(i+1)+"/"+loops+")");
        }


        console.log("\nCompiling Looped Video...")
        var temp = 0.0;
        return new Promise(function(resolve, reject) {
            ffmpegCommand.mergeToFile( tmpFolder+'/tmp_'+ outputFileName, "./")
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('progress', function(progress) {
                //console.log();
                temp = (progress.percent/loops);
                temp = Math.max(0.0,temp).toFixed(2);
                printProgress('Processing: ' + temp + '%');
            })
            .on('end', function() {
                printProgress("Processing: 100%");
                console.log('\n\n');
                ffmpegCommand.setMaxListeners(4);
                resolve(1);
            });
        });
        

    } catch (e) {
        console.log("Error "+e.code +": "+e.msg);
    }

    
}

function printProgress(m)
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(m);
}

async function getMediaDuration( name )
{
    return new Promise(function(resolve, reject) {
        
        fluent_ffmpeg.ffprobe( tmpFolder+'/'+ name , { path: ffprobeStatic.path }, function(err, info) {
            //console.log( "./" + name + " Meta: ");
            //console.log(info.streams[0]);
            resolve(info.streams[0]);
            //console.log(info.format);
            //resolve(info.format);
        })
    });
}

async function saveLinkToFile( link, fileName )
{
    var file = fs.createWriteStream(tmpFolder +'/'+fileName);

    return new Promise(function(resolve, reject) {

        https.get(link, function(response) {
            response
            .on('end',function(){
                console.log("Saved Temp File: " + fileName);
                resolve(1);
            })
            .pipe(file);
            
        });

    });
}



async function downloadCoub(url)
{

    var locUrl = url;
    console.log( "Requesting Url: " + locUrl );
    console.log(" ");
    console.log(" ");

    return new Promise(function(resolve, reject) {
        https.get(locUrl, function(res){

            console.log("Got response: " + res.statusCode);
            res.on('data', function(chunk){
                parseHtml(chunk);
                resolve(1);
            });

        
        }).on('error', function(e){
            console.log("Got error: " + e.message);
        
        });
    });
    

}


//const colorText = require('colors');





function checkIfUrlIsValid(url)
{
    var s = url.split("/");
    if( 
        s.length == 5       &&
        s[0] == "https:"    &&
        s[1] == ""          &&
        s[2] == "coub.com"
        )
    {
        s[3] = "embed";
        return s.join('/');
    }
    return "";
}


function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms);
    });
} 


async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

function printHelp()
{
    printVersion();
    printUseInfo();
    printFilePaths();
    printSettings();
    console.log("\nCommands:");
    console.log("   exit                Exit Coub Video Downloader");
    console.log("   setMode             Set download mode");
    console.log("       mode:0          Limit by max loops");
    console.log("       mode:1          Limit by audio duration");
    console.log("   setMaxLoops         Set the max video loops");
    console.log("   overrideMaxLoops    (enable/disable) Override absolute max loops");
    console.log("   reset               Reset settings to default.")
    console.log("   setDownloadFolder   Set folder the save downloaded videos to.");
    console.log("   setTempFolder       Set folder for temporary files.");
    console.log("   setFfmpegPath       Set the path to ffmpeg.exe");
    console.log("   setFfprobePath      Set the path to ffprobe.exe");
    console.log("   resetFilePaths      Reset all file paths.")
    console.log("   saveSettings        Save all setting values.");
    console.log("\nNote:");
    console.log("   Mode:1 may greatly increase video loop count.");
    console.log("   High video loop counts will increase CPU usage.");
    console.log("   Use Mode:1 and OverrideMaxLoops with caution!");
}

function printHelpDialouge()
{
    console.log("\ntype \"help\" for commands and info");
}

function printUseInfo()
{
    console.log("\nEnter a URL of the following forms:");
    console.log("   https://coub.com/view/######");
    console.log("   https://coub.com/embed/######");
}

function printVersion()
{
    console.log("\n\nNodeJs Coub Video Downloader");
    console.log("Version 0.0.1");
}

function printSettings()
{
    console.log("\nSettings:");
    console.log("   Mode:                       "+limitMode);
    console.log("   Max Video Loops:            "+maxLoops);
    console.log("   Absolute Max Video Loops:   "+absoluteMaxLoops);
    console.log("   Override Max Loops:         "+overrideMaxLoops);
}

function printFilePaths()
{
    console.log("\nFile Paths:");
    console.log("   Download Folder:    "+outputFolder);
    console.log("   Temp Folder:        "+tmpFolder);
    console.log("   ffmpeg Path:        "+ffmpegPath);
    console.log("   ffprob Path:        "+ffprobePath);
}

function removeWhiteSpace(s) { return s.replace(/\s+/g, ''); }





function setMode(s)
{
    s = removeWhiteSpace(s);
    var x = parseInt(s,10);

    if( x<0 || x>1 || isNaN(x) )
    {
        console.log("\n\nInvalid Mode!");
        console.log("type \'help\' for more info.");
        return;
    }

    limitMode = s;
    console.log("\nMode:"+limitMode+" set");

}

function setMaxLoops(s)
{
    s = removeWhiteSpace(s);
    var x = parseInt(s,10);

    if( x>absoluteMaxLoops && !overrideMaxLoops )
    {
        console.log("\n\nABSOLUTE MAX LOOPS EXCEDED!");
        console.log("use \'overrideMaxLoops\' to use higher loop counts.");
        console.log("\nAbsolute Max Loops: "+absoluteMaxLoops);
        console.log("Max Loops: "+maxLoops);
        return;
    }
    if( x<1 )
    {
        console.log("\n\nInput value too low");
        console.log("Max Loops: "+maxLoops);
        return;
    }
    if(isNaN(x))
    {
        console.log("\n\nNON NUMBER ENTERED!");
        console.log("Max Loops: "+maxLoops);
        return;
    }

    maxLoops = s;
    console.log("\nMax Loops: "+maxLoops+" set");
}

async function toggleOverrideMaxLoops()
{
    if(overrideMaxLoops)
    {
        overrideMaxLoops = false;
        console.log("\nOverride Max Loops Diabled.");
        if(maxLoops>absoluteMaxLoops)
        {
            maxLoops = absoluteMaxLoops;
            console.log("\nMax Loops: "+maxLoops+" set");
        }

        return;
    }
    console.log("\nCAUTION! Override may greatly increase CPU usage!");
    if(await askQuestion("type \'yes\' to enable: ") == "yes")
    {
        overrideMaxLoops = true;
        console.log("\nOverride Max Loops Enabled!");
    }
}

var settingsFile = "./settings.txt"

function createSettingsFile()
{
    var file = fs.createWriteStream(settingsFile, {
        flags: 'w' // 'a' append 'w' write
    });
    file.write(
        "Mode\n"                +limitMode
        +"\nMaxLoops\n"         +maxLoops
        +"\nOverrideMaxLoops\n" +overrideMaxLoops

        +"\nDownloadFolder\n"   +outputFolder
        +"\nTempFolder\n"       +tmpFolder
        +"\nffmpegPath\n"       +ffmpegPath
        +"\nffprobePath\n"      +ffprobePath
        );
    console.log("\nCreated Settings File.");
}

function loadSettings()
{
    if(fs.existsSync(settingsFile))
    {
        var s = "";
        try {
            s = fs.readFileSync(settingsFile, 'utf8');  
        } catch(e) {
            console.log('Error:', e.stack);
        }

        s = s.split('\n');
        
        var temp = 0;

        if(s.length==14)
        {
            var updateFile = false;

            // load limit mode
            temp = parseInt(s[1]);
            if(isNaN(temp))
            {
                mode = 0;
                updateFile = true;
            }else{
                if(temp>1 || temp<0)
                {
                    mode = 0;
                    updateFile = true;
                }else{
                    mode = temp;
                }
            }

            // load override max loops
            if( s[5] == 'true'){
                overrideMaxLoops = true;
            }else if( s[5] == 'false' ){
                overrideMaxLoops = false;
            }else{
                updateFile = true;
                overrideMaxLoops = false;
            }

            // load max loops
            temp = parseInt(s[3]);
            if(isNaN(temp))
            {
                maxLoops = defaultMaxLoops;
                updateFile = true;
            }else{
                if(temp<0)
                {
                    maxLoops = defaultMaxLoops;
                    updateFile = true;
                }else{
                    if( temp>absoluteMaxLoops && !overrideMaxLoops )
                    {
                        temp = absoluteMaxLoops;
                        updateFile = true;
                    }
                    temp = Math.max(1,temp);
                    maxLoops = temp;
                }
            }

            // load download folder
            if(fs.existsSync(s[7]))
            {
                outputFolder = s[7];
            }else{
                outputFolder = defaultOutputFolder;
                updateFile = true;
            }
            // load temp folder
            if(fs.existsSync(s[9]))
            {
                tmpFolder = s[9];
            }else{
                tmpFolder = defaultTmpFolder;
                updateFile = true;
            }
            // load ffmpeg.exe path
            if(fs.existsSync(s[11]))
            {
                ffmpegPath = s[11];
            }else{
                ffmpegPath = defaultFfmpegPath;
                updateFile = true;
            }
            // load ffprobe.exe path
            if(fs.existsSync(s[13]))
            {
                ffprobePath = s[13];
            }else{
                ffprobePath = defaultFfprobePath;
                updateFile = true;
            }

            // update settings file if a setting was invalid
            if(updateFile)
            {
                console.log("\n\nOne or more setings were invalid.");
                saveSettings();
            }

            console.log("\nSettings Loaded");
        }else{
            console.log("FAILD TO READ SETTINGS FILE");
            saveSettings();
        }

    }else{
        createSettingsFile();
    }

    printSettings();
}

function saveSettings()
{
    fs.unlinkSync(settingsFile);
    createSettingsFile();
    console.log("Settings Saved");
}

function resetSettings()
{
    overrideMaxLoops    = false;
    maxLoops            = defaultMaxLoops;
    limitMode           = 0;

    printSettings();
    
}

function resetFilePaths()
{
    outputFolder    = defaultOutputFolder;
    tmpFolder       = defaultTmpFolder;
    ffmpegPath      = defaultFfmpegPath;
    ffprobePath     = defaultFfprobePath;

    printFilePaths();
}

function alertTerminal(){
    console.log("\007");
}

function setFileDirectory(directory,current)
{
    if(fs.existsSync(directory))
    {
        console.log("\nFile Set");
        return directory;
    }else{
        console.log("\nFile Not Found!");
        return current;
    }
}

var running = true;
var downloadComplete = false;

async function main()
{

    var url = "";

    printVersion();
    loadSettings();
    printUseInfo();
    printHelpDialouge();
    

    while(running == true)
    {

        

        console.log("\n\n");
        url = await askQuestion("Enter URL or Command: ");
        console.log("\n\n");

        url = removeWhiteSpace(url);
        //console.log(url);

        switch(url)
        {
            case "resetFilePaths":
                resetFilePaths();
                break;

            case "setFfmpegPath":
                console.log("\nPath: C:/..../ffmpeg.exe");
                ffmpegPath = setFileDirectory(await askQuestion("Enter Path: "), ffmpegPath);
                fluent_ffmpeg.setFfmpegPath(ffmpegPath);
                break;

            case "setFfprobePath":
                console.log("\nPath: C:/..../ffprob.exe");
                ffprobePath = setFileDirectory(await askQuestion("Enter Path: "), ffprobePath);
                fluent_ffmpeg.setFfprobePath(ffprobePath);
                break;

            case "setDownloadFolder":
                console.log("\nPath: C:/..../FolderName");
                outputFolder = setFileDirectory(await askQuestion("Enter Path: "), outputFolder);
                break;

            case "setTempFolder":
                console.log("\nPath: C:/..../FolderName");
                tmpFolder = setFileDirectory(await askQuestion("Enter Path: "), tmpFolder);
                break;

            case "settings":
                printSettings();
                break;

            case "saveSettings":
                saveSettings();
                break;

            case "reset":
                resetSettings();
                break;

            case "setMode":
                setMode( await askQuestion("Enter Mode Number: ") );
                break;

            case "setMaxLoops":
                setMaxLoops( await askQuestion("Enter Loop Count: ") );
                break;

            case "overrideMaxLoops":
                await toggleOverrideMaxLoops();
                break;

            case "continue":
                break;

            case "help":
                printHelp();
                break;

            case "exit":
                running = false;
                break;

            default:
                
                url = checkIfUrlIsValid(url);
                if(url=="")
                {
                    console.error("Invalid URL");
                    printUseInfo();
                    break;
                } else{
                    downloadComplete = false;
                    await downloadCoub(url);
                    while(downloadComplete == false) { await sleep(1000);}
                    downloadComplete = false;
                }
                    
        }

    }
        

    console.log(" ");
    console.log("Exited Coub Video Downloader");
    console.log(" ");

}


main();


