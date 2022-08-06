var Module=typeof Module!="undefined"?Module:{};var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;let toLog=e;err("exiting due to exception: "+toLog)}var fs;var nodePath;var requireNodeFS;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}requireNodeFS=()=>{if(!nodePath){fs=require("fs");nodePath=require("path")}};read_=function shell_read(filename,binary){var ret=tryParseAsDataURI(filename);if(ret){return binary?ret:ret.toString()}requireNodeFS();filename=nodePath["normalize"](filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror)=>{var ret=tryParseAsDataURI(filename);if(ret){onload(ret)}requireNodeFS();filename=nodePath["normalize"](filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);if(typeof module!="undefined"){module["exports"]=Module}process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});quit_=(status,toThrow)=>{if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort(text)}}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){{if(Module["onAbort"]){Module["onAbort"](what)}}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;wasmBinaryFile="data:application/octet-stream;base64,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";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(file);if(binary){return binary}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["d"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["h"];addOnInit(Module["asm"]["e"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}function _abort(){abort("")}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function getHeapMax(){return 2147483648}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var ASSERTIONS=false;var decodeBase64=typeof atob=="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE=="boolean"&&ENVIRONMENT_IS_NODE){var buf=Buffer.from(s,"base64");return new Uint8Array(buf["buffer"],buf["byteOffset"],buf["byteLength"])}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var asmLibraryArg={"b":_abort,"c":_emscripten_memcpy_big,"a":_emscripten_resize_heap};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["e"]).apply(null,arguments)};var _jsCubeMap=Module["_jsCubeMap"]=function(){return(_jsCubeMap=Module["_jsCubeMap"]=Module["asm"]["f"]).apply(null,arguments)};var _viewerQuery=Module["_viewerQuery"]=function(){return(_viewerQuery=Module["_viewerQuery"]=Module["asm"]["g"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["i"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["j"]).apply(null,arguments)};var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();
