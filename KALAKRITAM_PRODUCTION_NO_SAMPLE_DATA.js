var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// KALAKRITAM_PRODUCTION_NO_SAMPLE_DATA.js
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res) => /* @__PURE__ */ __name(function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
}, "__init"), "__esm");
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
var __publicField = /* @__PURE__ */ __name((obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
}, "__publicField");
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name2(createNotImplementedError, "createNotImplementedError");
    __name2(notImplemented, "notImplemented");
    __name2(notImplementedClass, "notImplementedClass");
  }
});
var _timeOrigin;
var _performanceNow;
var nodeTiming;
var PerformanceEntry;
var PerformanceMark;
var PerformanceMeasure;
var PerformanceResourceTiming;
var PerformanceObserverEntryList;
var Performance;
var PerformanceObserver;
var performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name2(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name2(class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark2");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    __name2(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name2(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name2(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name2(Performance, "Performance");
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name2(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});
var MockWritable = class {
  static {
    __name(this, "MockWritable");
  }
  write() {
    return true;
  }
  end() {
    return this;
  }
};
var _console;
var _ignoreErrors;
var _stderr;
var _stdout;
var log;
var info;
var trace;
var debug;
var table;
var error;
var warn;
var createTask;
var clear;
var count;
var countReset;
var dir;
var dirxml;
var group;
var groupEnd;
var groupCollapsed;
var profile;
var profileEnd;
var time;
var timeEnd;
var timeLog;
var timeStamp;
var Console;
var _times;
var _stdoutErrorHandler;
var _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new MockWritable();
    _stdout = new MockWritable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});
var workerdConsole;
var assert;
var clear2;
var context;
var count2;
var countReset2;
var createTask2;
var debug2;
var dir2;
var dirxml2;
var error2;
var group2;
var groupCollapsed2;
var groupEnd2;
var info2;
var log2;
var profile2;
var profileEnd2;
var table2;
var time2;
var timeEnd2;
var timeLog2;
var timeStamp2;
var trace2;
var warn2;
var console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint"), "bigint") });
  }
});
var MockSocket = class {
  static {
    __name(this, "MockSocket");
  }
  constructor() {
  }
};
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends MockSocket {
      static {
        __name(this, "ReadStream");
      }
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name2(ReadStream, "ReadStream");
  }
});
var MockSocket2 = class {
  static {
    __name(this, "MockSocket2");
  }
  constructor() {
  }
};
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends MockSocket2 {
      static {
        __name(this, "WriteStream");
      }
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x2, y2, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name2(WriteStream, "WriteStream");
  }
});
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});
var MockEventEmitter = class {
  static {
    __name(this, "MockEventEmitter");
  }
  constructor() {
    this._events = {};
    this._eventsCount = 0;
  }
  on(event, listener) {
    return this;
  }
  emit(event, ...args) {
    return false;
  }
  removeListener(event, listener) {
    return this;
  }
  off(event, listener) {
    return this;
  }
  once(event, listener) {
    return this;
  }
};
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends MockEventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(MockEventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name2(Process, "Process");
  }
});
var globalProcess;
var getBuiltinModule;
var exit;
var platform;
var nextTick;
var unenvProcess;
var abort;
var addListener;
var allowedNodeEnvironmentFlags;
var hasUncaughtExceptionCaptureCallback;
var setUncaughtExceptionCaptureCallback;
var loadEnvFile;
var sourceMapsEnabled;
var arch;
var argv;
var argv0;
var chdir;
var config;
var connected;
var constrainedMemory;
var availableMemory;
var cpuUsage;
var cwd;
var debugPort;
var dlopen;
var disconnect;
var emit;
var emitWarning;
var env;
var eventNames;
var execArgv;
var execPath;
var finalization;
var features;
var getActiveResourcesInfo;
var getMaxListeners;
var hrtime3;
var kill;
var listeners;
var listenerCount;
var memoryUsage;
var on;
var off;
var once;
var pid;
var ppid;
var prependListener;
var prependOnceListener;
var rawListeners;
var release;
var removeAllListeners;
var removeListener;
var report;
var resourceUsage;
var setMaxListeners;
var setSourceMapsEnabled;
var stderr;
var stdin;
var stdout;
var title;
var throwDeprecation;
var traceDeprecation;
var umask;
var uptime;
var version;
var versions;
var domain;
var initgroups;
var moduleLoadList;
var reallyExit;
var openStdin;
var assert2;
var binding;
var send;
var exitCode;
var channel;
var getegid;
var geteuid;
var getgid;
var getgroups;
var getuid;
var setegid;
var seteuid;
var setgid;
var setgroups;
var setuid;
var permission;
var mainModule;
var _events;
var _eventsCount;
var _exiting;
var _maxListeners;
var _debugEnd;
var _debugProcess;
var _fatalException;
var _getActiveHandles;
var _getActiveRequests;
var _kill;
var _preload_modules;
var _rawDebug;
var _startProfilerIdleNotifier;
var _stopProfilerIdleNotifier;
var _tickCallback;
var _disconnect;
var _handleQueue;
var _pendingMessage;
var _channel;
var _send;
var _linkedBinding;
var _process;
var process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"] || {};
    getBuiltinModule = globalProcess.getBuiltinModule || (() => ({}));
    ({ exit, platform, nextTick } = getBuiltinModule(
      "process"
      // Removed "node:" prefix for Cloudflare Workers compatibility
    ) || {
      exit: /* @__PURE__ */ __name(() => {
      }, "exit"),
      platform: "linux",
      nextTick: /* @__PURE__ */ __name((fn) => Promise.resolve().then(fn), "nextTick")
    });
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});
function Ge(r) {
  let e = 1779033703, t = 3144134277, n = 1013904242, i = 2773480762, s = 1359893119, o = 2600822924, u = 528734635, c = 1541459225, h = 0, l = 0, d = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], b = a(
    (A, w) => A >>> w | A << 32 - w,
    "rrot"
  ), C = new Uint32Array(64), B = new Uint8Array(64), W = a(() => {
    for (let R = 0, G = 0; R < 16; R++, G += 4)
      C[R] = B[G] << 24 | B[G + 1] << 16 | B[G + 2] << 8 | B[G + 3];
    for (let R = 16; R < 64; R++) {
      let G = b(C[R - 15], 7) ^ b(C[R - 15], 18) ^ C[R - 15] >>> 3, he = b(C[R - 2], 17) ^ b(C[R - 2], 19) ^ C[R - 2] >>> 10;
      C[R] = C[R - 16] + G + C[R - 7] + he | 0;
    }
    let A = e, w = t, P = n, V = i, k = s, j = o, ce = u, ee = c;
    for (let R = 0; R < 64; R++) {
      let G = b(
        k,
        6
      ) ^ b(k, 11) ^ b(k, 25), he = k & j ^ ~k & ce, ye = ee + G + he + d[R] + C[R] | 0, xe = b(A, 2) ^ b(A, 13) ^ b(A, 22), me = A & w ^ A & P ^ w & P, se = xe + me | 0;
      ee = ce, ce = j, j = k, k = V + ye | 0, V = P, P = w, w = A, A = ye + se | 0;
    }
    e = e + A | 0, t = t + w | 0, n = n + P | 0, i = i + V | 0, s = s + k | 0, o = o + j | 0, u = u + ce | 0, c = c + ee | 0, l = 0;
  }, "process"), X = a((A) => {
    typeof A == "string" && (A = new TextEncoder().encode(A));
    for (let w = 0; w < A.length; w++)
      B[l++] = A[w], l === 64 && W();
    h += A.length;
  }, "add"), de = a(() => {
    if (B[l++] = 128, l == 64 && W(), l + 8 > 64) {
      for (; l < 64; )
        B[l++] = 0;
      W();
    }
    for (; l < 58; )
      B[l++] = 0;
    let A = h * 8;
    B[l++] = A / 1099511627776 & 255, B[l++] = A / 4294967296 & 255, B[l++] = A >>> 24, B[l++] = A >>> 16 & 255, B[l++] = A >>> 8 & 255, B[l++] = A & 255, W();
    let w = new Uint8Array(32);
    return w[0] = e >>> 24, w[1] = e >>> 16 & 255, w[2] = e >>> 8 & 255, w[3] = e & 255, w[4] = t >>> 24, w[5] = t >>> 16 & 255, w[6] = t >>> 8 & 255, w[7] = t & 255, w[8] = n >>> 24, w[9] = n >>> 16 & 255, w[10] = n >>> 8 & 255, w[11] = n & 255, w[12] = i >>> 24, w[13] = i >>> 16 & 255, w[14] = i >>> 8 & 255, w[15] = i & 255, w[16] = s >>> 24, w[17] = s >>> 16 & 255, w[18] = s >>> 8 & 255, w[19] = s & 255, w[20] = o >>> 24, w[21] = o >>> 16 & 255, w[22] = o >>> 8 & 255, w[23] = o & 255, w[24] = u >>> 24, w[25] = u >>> 16 & 255, w[26] = u >>> 8 & 255, w[27] = u & 255, w[28] = c >>> 24, w[29] = c >>> 16 & 255, w[30] = c >>> 8 & 255, w[31] = c & 255, w;
  }, "digest");
  return r === void 0 ? { add: X, digest: de } : (X(r), de());
}
__name(Ge, "Ge");
function Vo(r) {
  return g.getRandomValues(y.alloc(r));
}
__name(Vo, "Vo");
function Ko(r) {
  if (r === "sha256")
    return { update: a(
      function(e) {
        return { digest: a(function() {
          return y.from(Ge(e));
        }, "digest") };
      },
      "update"
    ) };
  if (r === "md5")
    return { update: a(function(e) {
      return { digest: a(function() {
        return typeof e == "string" ? $e.hashStr(e) : $e.hashByteArray(e);
      }, "digest") };
    }, "update") };
  throw new Error(
    `Hash type '${r}' not supported`
  );
}
__name(Ko, "Ko");
function zo(r, e) {
  if (r !== "sha256")
    throw new Error(
      `Only sha256 is supported (requested: '${r}')`
    );
  return { update: a(function(t) {
    return {
      digest: a(function() {
        typeof e == "string" && (e = new TextEncoder().encode(e)), typeof t == "string" && (t = new TextEncoder().encode(t));
        let n = e.length;
        if (n > 64)
          e = Ge(e);
        else if (n < 64) {
          let c = new Uint8Array(64);
          c.set(e), e = c;
        }
        let i = new Uint8Array(64), s = new Uint8Array(
          64
        );
        for (let c = 0; c < 64; c++)
          i[c] = 54 ^ e[c], s[c] = 92 ^ e[c];
        let o = new Uint8Array(t.length + 64);
        o.set(i, 0), o.set(t, 64);
        let u = new Uint8Array(96);
        return u.set(s, 0), u.set(
          Ge(o),
          64
        ), y.from(Ge(u));
      }, "digest")
    };
  }, "update") };
}
__name(zo, "zo");
function ou(...r) {
  return r.join("/");
}
__name(ou, "ou");
function au(r, e) {
  e(new Error("No filesystem"));
}
__name(au, "au");
function fr(r, e = false) {
  let { protocol: t } = new URL(r), n = "http:" + r.substring(t.length), {
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: h,
    search: l,
    searchParams: d,
    hash: b
  } = new URL(n);
  s = decodeURIComponent(s), i = decodeURIComponent(
    i
  ), h = decodeURIComponent(h);
  let C = i + ":" + s, B = e ? Object.fromEntries(d.entries()) : l;
  return {
    href: r,
    protocol: t,
    auth: C,
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: h,
    search: l,
    query: B,
    hash: b
  };
}
__name(fr, "fr");
function Fu(r) {
  return 0;
}
__name(Fu, "Fu");
function lc({ socket: r, servername: e }) {
  return r.startTls(e), r;
}
__name(lc, "lc");
function Ys(r, {
  arrayMode: e,
  fullResults: t,
  fetchOptions: n,
  isolationLevel: i,
  readOnly: s,
  deferrable: o,
  queryCallback: u,
  resultCallback: c
} = {}) {
  if (!r)
    throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
  let h;
  try {
    h = fr(r);
  } catch {
    throw new Error("Database connection string provided to `neon()` is not a valid URL. Connection string: " + String(r));
  }
  let {
    protocol: l,
    username: d,
    password: b,
    hostname: C,
    port: B,
    pathname: W
  } = h;
  if (l !== "postgres:" && l !== "postgresql:" || !d || !b || !C || !W)
    throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");
  function X(A, ...w) {
    let P, V;
    if (typeof A == "string")
      P = A, V = w[1], w = w[0] ?? [];
    else {
      P = "";
      for (let j = 0; j < A.length; j++)
        P += A[j], j < w.length && (P += "$" + (j + 1));
    }
    w = w.map((j) => (0, Ks.prepareValue)(j));
    let k = {
      query: P,
      params: w
    };
    return u && u(k), Qc(de, k, V);
  }
  __name(X, "X");
  __name2(X, "X");
  a(X, "resolve"), X.transaction = async (A, w) => {
    if (typeof A == "function" && (A = A(X)), !Array.isArray(A))
      throw new Error($s);
    A.forEach((k) => {
      if (k[Symbol.toStringTag] !== "NeonQueryPromise")
        throw new Error($s);
    });
    let P = A.map((k) => k.parameterizedQuery), V = A.map((k) => k.opts ?? {});
    return de(P, V, w);
  };
  async function de(A, w, P) {
    let {
      fetchEndpoint: V,
      fetchFunction: k
    } = _e, j = typeof V == "function" ? V(C, B) : V, ce = Array.isArray(A) ? { queries: A } : A, ee = n ?? {}, R = e ?? false, G = t ?? false, he = i, ye = s, xe = o;
    P !== void 0 && (P.fetchOptions !== void 0 && (ee = { ...ee, ...P.fetchOptions }), P.arrayMode !== void 0 && (R = P.arrayMode), P.fullResults !== void 0 && (G = P.fullResults), P.isolationLevel !== void 0 && (he = P.isolationLevel), P.readOnly !== void 0 && (ye = P.readOnly), P.deferrable !== void 0 && (xe = P.deferrable)), w !== void 0 && !Array.isArray(w) && w.fetchOptions !== void 0 && (ee = { ...ee, ...w.fetchOptions });
    let me = { "Neon-Connection-String": r, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" };
    Array.isArray(A) && (he !== void 0 && (me["Neon-Batch-Isolation-Level"] = he), ye !== void 0 && (me["Neon-Batch-Read-Only"] = String(ye)), xe !== void 0 && (me["Neon-Batch-Deferrable"] = String(
      xe
    )));
    let se;
    try {
      se = await (k ?? fetch)(j, {
        method: "POST",
        body: JSON.stringify(ce),
        headers: me,
        ...ee
      });
    } catch (oe) {
      let U = new Ae(`Error connecting to database: ${oe.message}`);
      throw U.sourceError = oe, U;
    }
    if (se.ok) {
      let oe = await se.json();
      if (Array.isArray(A)) {
        let U = oe.results;
        if (!Array.isArray(U))
          throw new Ae("Neon internal error: unexpected result format");
        return U.map((K, le) => {
          let It = w[le] ?? {}, Xs = It.arrayMode ?? R, eo = It.fullResults ?? G;
          return Vs(K, {
            arrayMode: Xs,
            fullResults: eo,
            parameterizedQuery: A[le],
            resultCallback: c,
            types: It.types
          });
        });
      } else {
        let U = w ?? {}, K = U.arrayMode ?? R, le = U.fullResults ?? G;
        return Vs(
          oe,
          { arrayMode: K, fullResults: le, parameterizedQuery: A, resultCallback: c, types: U.types }
        );
      }
    } else {
      let { status: oe } = se;
      if (oe === 400) {
        let U = await se.json(), K = new Ae(U.message);
        for (let le of qc)
          K[le] = U[le] ?? void 0;
        throw K;
      } else {
        let U = await se.text();
        throw new Ae(`Server error (HTTP status ${oe}): ${U}`);
      }
    }
  }
  __name(de, "de");
  __name2(de, "de");
  return a(de, "execute"), X;
}
__name(Ys, "Ys");
function Qc(r, e, t) {
  return { [Symbol.toStringTag]: "NeonQueryPromise", parameterizedQuery: e, opts: t, then: a(
    (n, i) => r(e, t).then(n, i),
    "then"
  ), catch: a((n) => r(e, t).catch(n), "catch"), finally: a((n) => r(
    e,
    t
  ).finally(n), "finally") };
}
__name(Qc, "Qc");
function Vs(r, {
  arrayMode: e,
  fullResults: t,
  parameterizedQuery: n,
  resultCallback: i,
  types: s
}) {
  let o = new zs.default(
    s
  ), u = r.fields.map((l) => l.name), c = r.fields.map((l) => o.getTypeParser(l.dataTypeID)), h = e === true ? r.rows.map((l) => l.map((d, b) => d === null ? null : c[b](d))) : r.rows.map((l) => Object.fromEntries(
    l.map((d, b) => [u[b], d === null ? null : c[b](d)])
  ));
  return i && i(n, r, h, { arrayMode: e, fullResults: t }), t ? (r.viaNeonFetch = true, r.rowAsArray = e, r.rows = h, r._parsers = c, r._types = o, r) : h;
}
__name(Vs, "Vs");
function Wc(r, e) {
  if (e)
    return {
      callback: e,
      result: void 0
    };
  let t, n, i = a(function(o, u) {
    o ? t(o) : n(u);
  }, "cb"), s = new r(function(o, u) {
    n = o, t = u;
  });
  return { callback: i, result: s };
}
__name(Wc, "Wc");
var to;
var Ce;
var ro;
var no;
var io;
var so;
var oo;
var a;
var z;
var I;
var ie;
var An;
var Te;
var N;
var _;
var In;
var Pn;
var $n;
var S;
var x;
var v;
var g;
var y;
var m;
var p;
var we;
var je;
var $o;
var He;
var ni;
var O;
var $e;
var ii;
var qt;
var Qt;
var jt;
var Ht;
var ci;
var li;
var di;
var mi;
var Ei;
var Ai;
var Bi;
var Ri;
var Je;
var Xe;
var et;
var qi;
var tr;
var rr;
var nr;
var ir;
var sr;
var uu;
var or;
var Qi;
var ur;
var ar;
var Wi;
var $i;
var zi;
var Zi;
var mt;
var Xi;
var Tu;
var es;
var ts;
var pr;
var ns;
var gt;
var cs;
var ps;
var ys;
var ds;
var Mu;
var E;
var _e;
var wt;
var Yr;
var ms;
var ws;
var bs;
var vs;
var an;
var Es;
var _s;
var hn;
var Bs;
var Ms;
var Ds;
var Cc;
var ks;
var Us;
var qs;
var Hs;
var bn;
var Ct;
var Tt;
var Ks;
var zs;
var xn;
var Ae;
var $s;
var qc;
var Js;
var Qe;
var En;
var vn;
var _n;
var export_ClientBase;
var export_Connection;
var export_DatabaseError;
var export_Query;
var export_defaults;
var export_types;
var init_serverless = __esm({
  "node_modules/@neondatabase/serverless/index.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    to = Object.create;
    Ce = Object.defineProperty;
    ro = Object.getOwnPropertyDescriptor;
    no = Object.getOwnPropertyNames;
    io = Object.getPrototypeOf;
    so = Object.prototype.hasOwnProperty;
    oo = /* @__PURE__ */ __name2((r, e, t) => e in r ? Ce(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t, "oo");
    a = /* @__PURE__ */ __name2((r, e) => Ce(r, "name", { value: e, configurable: true }), "a");
    z = /* @__PURE__ */ __name2((r, e) => () => (r && (e = r(r = 0)), e), "z");
    I = /* @__PURE__ */ __name2((r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports), "I");
    ie = /* @__PURE__ */ __name2((r, e) => {
      for (var t in e)
        Ce(r, t, { get: e[t], enumerable: true });
    }, "ie");
    An = /* @__PURE__ */ __name2((r, e, t, n) => {
      if (e && typeof e == "object" || typeof e == "function")
        for (let i of no(e))
          !so.call(r, i) && i !== t && Ce(r, i, { get: /* @__PURE__ */ __name(() => e[i], "get"), enumerable: !(n = ro(e, i)) || n.enumerable });
      return r;
    }, "An");
    Te = /* @__PURE__ */ __name2((r, e, t) => (t = r != null ? to(io(r)) : {}, An(e || !r || !r.__esModule ? Ce(t, "default", {
      value: r,
      enumerable: true
    }) : t, r)), "Te");
    N = /* @__PURE__ */ __name2((r) => An(Ce({}, "__esModule", { value: true }), r), "N");
    _ = /* @__PURE__ */ __name2((r, e, t) => oo(r, typeof e != "symbol" ? e + "" : e, t), "_");
    In = I((nt) => {
      "use strict";
      p();
      nt.byteLength = uo;
      nt.toByteArray = ho;
      nt.fromByteArray = po;
      var ae = [], te = [], ao = typeof Uint8Array < "u" ? Uint8Array : Array, Pt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (ve = 0, Cn = Pt.length; ve < Cn; ++ve)
        ae[ve] = Pt[ve], te[Pt.charCodeAt(ve)] = ve;
      var ve, Cn;
      te[45] = 62;
      te[95] = 63;
      function Tn(r) {
        var e = r.length;
        if (e % 4 > 0)
          throw new Error("Invalid string. Length must be a multiple of 4");
        var t = r.indexOf("=");
        t === -1 && (t = e);
        var n = t === e ? 0 : 4 - t % 4;
        return [t, n];
      }
      __name(Tn, "Tn");
      __name2(Tn, "Tn");
      a(
        Tn,
        "getLens"
      );
      function uo(r) {
        var e = Tn(r), t = e[0], n = e[1];
        return (t + n) * 3 / 4 - n;
      }
      __name(uo, "uo");
      __name2(uo, "uo");
      a(uo, "byteLength");
      function co(r, e, t) {
        return (e + t) * 3 / 4 - t;
      }
      __name(co, "co");
      __name2(co, "co");
      a(co, "_byteLength");
      function ho(r) {
        var e, t = Tn(r), n = t[0], i = t[1], s = new ao(co(r, n, i)), o = 0, u = i > 0 ? n - 4 : n, c;
        for (c = 0; c < u; c += 4)
          e = te[r.charCodeAt(c)] << 18 | te[r.charCodeAt(c + 1)] << 12 | te[r.charCodeAt(c + 2)] << 6 | te[r.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
        return i === 2 && (e = te[r.charCodeAt(c)] << 2 | te[r.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = te[r.charCodeAt(
          c
        )] << 10 | te[r.charCodeAt(c + 1)] << 4 | te[r.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
      }
      __name(ho, "ho");
      __name2(ho, "ho");
      a(ho, "toByteArray");
      function lo(r) {
        return ae[r >> 18 & 63] + ae[r >> 12 & 63] + ae[r >> 6 & 63] + ae[r & 63];
      }
      __name(lo, "lo");
      __name2(lo, "lo");
      a(lo, "tripletToBase64");
      function fo(r, e, t) {
        for (var n, i = [], s = e; s < t; s += 3)
          n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(lo(n));
        return i.join(
          ""
        );
      }
      __name(fo, "fo");
      __name2(fo, "fo");
      a(fo, "encodeChunk");
      function po(r) {
        for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n; o < u; o += s)
          i.push(fo(r, o, o + s > u ? u : o + s));
        return n === 1 ? (e = r[t - 1], i.push(ae[e >> 2] + ae[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(ae[e >> 10] + ae[e >> 4 & 63] + ae[e << 2 & 63] + "=")), i.join("");
      }
      __name(po, "po");
      __name2(po, "po");
      a(po, "fromByteArray");
    });
    Pn = I((Bt) => {
      p();
      Bt.read = function(r, e, t, n, i) {
        var s, o, u = i * 8 - n - 1, c = (1 << u) - 1, h = c >> 1, l = -7, d = t ? i - 1 : 0, b = t ? -1 : 1, C = r[e + d];
        for (d += b, s = C & (1 << -l) - 1, C >>= -l, l += u; l > 0; s = s * 256 + r[e + d], d += b, l -= 8)
          ;
        for (o = s & (1 << -l) - 1, s >>= -l, l += n; l > 0; o = o * 256 + r[e + d], d += b, l -= 8)
          ;
        if (s === 0)
          s = 1 - h;
        else {
          if (s === c)
            return o ? NaN : (C ? -1 : 1) * (1 / 0);
          o = o + Math.pow(2, n), s = s - h;
        }
        return (C ? -1 : 1) * o * Math.pow(2, s - n);
      };
      Bt.write = function(r, e, t, n, i, s) {
        var o, u, c, h = s * 8 - i - 1, l = (1 << h) - 1, d = l >> 1, b = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, C = n ? 0 : s - 1, B = n ? 1 : -1, W = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
        for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = l) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + d >= 1 ? e += b / c : e += b * Math.pow(2, 1 - d), e * c >= 2 && (o++, c /= 2), o + d >= l ? (u = 0, o = l) : o + d >= 1 ? (u = (e * c - 1) * Math.pow(
          2,
          i
        ), o = o + d) : (u = e * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + C] = u & 255, C += B, u /= 256, i -= 8)
          ;
        for (o = o << i | u, h += i; h > 0; r[t + C] = o & 255, C += B, o /= 256, h -= 8)
          ;
        r[t + C - B] |= W * 128;
      };
    });
    $n = I((Le) => {
      "use strict";
      p();
      var Lt = In(), Pe = Pn(), Bn = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      Le.Buffer = f;
      Le.SlowBuffer = So;
      Le.INSPECT_MAX_BYTES = 50;
      var it = 2147483647;
      Le.kMaxLength = it;
      f.TYPED_ARRAY_SUPPORT = yo();
      !f.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
      function yo() {
        try {
          let r = new Uint8Array(1), e = { foo: a(function() {
            return 42;
          }, "foo") };
          return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(
            r,
            e
          ), r.foo() === 42;
        } catch {
          return false;
        }
      }
      __name(yo, "yo");
      __name2(yo, "yo");
      a(yo, "typedArraySupport");
      Object.defineProperty(
        f.prototype,
        "parent",
        { enumerable: true, get: a(function() {
          if (f.isBuffer(this))
            return this.buffer;
        }, "get") }
      );
      Object.defineProperty(f.prototype, "offset", { enumerable: true, get: a(
        function() {
          if (f.isBuffer(this))
            return this.byteOffset;
        },
        "get"
      ) });
      function fe(r) {
        if (r > it)
          throw new RangeError('The value "' + r + '" is invalid for option "size"');
        let e = new Uint8Array(
          r
        );
        return Object.setPrototypeOf(e, f.prototype), e;
      }
      __name(fe, "fe");
      __name2(fe, "fe");
      a(fe, "createBuffer");
      function f(r, e, t) {
        if (typeof r == "number") {
          if (typeof e == "string")
            throw new TypeError('The "string" argument must be of type string. Received type number');
          return Dt(r);
        }
        return Mn(
          r,
          e,
          t
        );
      }
      __name(f, "f");
      __name2(f, "f");
      a(f, "Buffer");
      f.poolSize = 8192;
      function Mn(r, e, t) {
        if (typeof r == "string")
          return go(
            r,
            e
          );
        if (ArrayBuffer.isView(r))
          return wo(r);
        if (r == null)
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
        if (ue(r, ArrayBuffer) || r && ue(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (ue(r, SharedArrayBuffer) || r && ue(r.buffer, SharedArrayBuffer)))
          return Ft(r, e, t);
        if (typeof r == "number")
          throw new TypeError('The "value" argument must not be of type number. Received type number');
        let n = r.valueOf && r.valueOf();
        if (n != null && n !== r)
          return f.from(n, e, t);
        let i = bo(r);
        if (i)
          return i;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
          return f.from(r[Symbol.toPrimitive]("string"), e, t);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
      }
      __name(Mn, "Mn");
      __name2(Mn, "Mn");
      a(Mn, "from");
      f.from = function(r, e, t) {
        return Mn(r, e, t);
      };
      Object.setPrototypeOf(f.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(
        f,
        Uint8Array
      );
      function Dn(r) {
        if (typeof r != "number")
          throw new TypeError('"size" argument must be of type number');
        if (r < 0)
          throw new RangeError('The value "' + r + '" is invalid for option "size"');
      }
      __name(Dn, "Dn");
      __name2(Dn, "Dn");
      a(Dn, "assertSize");
      function mo(r, e, t) {
        return Dn(r), r <= 0 ? fe(r) : e !== void 0 ? typeof t == "string" ? fe(r).fill(e, t) : fe(r).fill(e) : fe(r);
      }
      __name(mo, "mo");
      __name2(mo, "mo");
      a(
        mo,
        "alloc"
      );
      f.alloc = function(r, e, t) {
        return mo(r, e, t);
      };
      function Dt(r) {
        return Dn(r), fe(
          r < 0 ? 0 : kt(r) | 0
        );
      }
      __name(Dt, "Dt");
      __name2(Dt, "Dt");
      a(Dt, "allocUnsafe");
      f.allocUnsafe = function(r) {
        return Dt(r);
      };
      f.allocUnsafeSlow = function(r) {
        return Dt(r);
      };
      function go(r, e) {
        if ((typeof e != "string" || e === "") && (e = "utf8"), !f.isEncoding(e))
          throw new TypeError("Unknown encoding: " + e);
        let t = kn(r, e) | 0, n = fe(t), i = n.write(r, e);
        return i !== t && (n = n.slice(0, i)), n;
      }
      __name(go, "go");
      __name2(go, "go");
      a(go, "fromString");
      function Rt(r) {
        let e = r.length < 0 ? 0 : kt(r.length) | 0, t = fe(e);
        for (let n = 0; n < e; n += 1)
          t[n] = r[n] & 255;
        return t;
      }
      __name(Rt, "Rt");
      __name2(Rt, "Rt");
      a(Rt, "fromArrayLike");
      function wo(r) {
        if (ue(r, Uint8Array)) {
          let e = new Uint8Array(r);
          return Ft(e.buffer, e.byteOffset, e.byteLength);
        }
        return Rt(r);
      }
      __name(wo, "wo");
      __name2(wo, "wo");
      a(wo, "fromArrayView");
      function Ft(r, e, t) {
        if (e < 0 || r.byteLength < e)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (r.byteLength < e + (t || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let n;
        return e === void 0 && t === void 0 ? n = new Uint8Array(
          r
        ) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(r, e, t), Object.setPrototypeOf(
          n,
          f.prototype
        ), n;
      }
      __name(Ft, "Ft");
      __name2(Ft, "Ft");
      a(Ft, "fromArrayBuffer");
      function bo(r) {
        if (f.isBuffer(r)) {
          let e = kt(
            r.length
          ) | 0, t = fe(e);
          return t.length === 0 || r.copy(t, 0, 0, e), t;
        }
        if (r.length !== void 0)
          return typeof r.length != "number" || Ot(r.length) ? fe(0) : Rt(r);
        if (r.type === "Buffer" && Array.isArray(r.data))
          return Rt(r.data);
      }
      __name(bo, "bo");
      __name2(bo, "bo");
      a(bo, "fromObject");
      function kt(r) {
        if (r >= it)
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + it.toString(16) + " bytes");
        return r | 0;
      }
      __name(kt, "kt");
      __name2(kt, "kt");
      a(kt, "checked");
      function So(r) {
        return +r != r && (r = 0), f.alloc(+r);
      }
      __name(So, "So");
      __name2(So, "So");
      a(So, "SlowBuffer");
      f.isBuffer = a(function(e) {
        return e != null && e._isBuffer === true && e !== f.prototype;
      }, "isBuffer");
      f.compare = a(function(e, t) {
        if (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)), ue(t, Uint8Array) && (t = f.from(t, t.offset, t.byteLength)), !f.isBuffer(e) || !f.isBuffer(t))
          throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === t)
          return 0;
        let n = e.length, i = t.length;
        for (let s = 0, o = Math.min(n, i); s < o; ++s)
          if (e[s] !== t[s]) {
            n = e[s], i = t[s];
            break;
          }
        return n < i ? -1 : i < n ? 1 : 0;
      }, "compare");
      f.isEncoding = a(function(e) {
        switch (String(e).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      }, "isEncoding");
      f.concat = a(function(e, t) {
        if (!Array.isArray(e))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (e.length === 0)
          return f.alloc(0);
        let n;
        if (t === void 0)
          for (t = 0, n = 0; n < e.length; ++n)
            t += e[n].length;
        let i = f.allocUnsafe(t), s = 0;
        for (n = 0; n < e.length; ++n) {
          let o = e[n];
          if (ue(o, Uint8Array))
            s + o.length > i.length ? (f.isBuffer(
              o
            ) || (o = f.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
          else if (f.isBuffer(
            o
          ))
            o.copy(i, s);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          s += o.length;
        }
        return i;
      }, "concat");
      function kn(r, e) {
        if (f.isBuffer(r))
          return r.length;
        if (ArrayBuffer.isView(r) || ue(r, ArrayBuffer))
          return r.byteLength;
        if (typeof r != "string")
          throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r);
        let t = r.length, n = arguments.length > 2 && arguments[2] === true;
        if (!n && t === 0)
          return 0;
        let i = false;
        for (; ; )
          switch (e) {
            case "ascii":
            case "latin1":
            case "binary":
              return t;
            case "utf8":
            case "utf-8":
              return Mt(r).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return t * 2;
            case "hex":
              return t >>> 1;
            case "base64":
              return Gn(r).length;
            default:
              if (i)
                return n ? -1 : Mt(r).length;
              e = ("" + e).toLowerCase(), i = true;
          }
      }
      __name(kn, "kn");
      __name2(kn, "kn");
      a(kn, "byteLength");
      f.byteLength = kn;
      function xo(r, e, t) {
        let n = false;
        if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e))
          return "";
        for (r || (r = "utf8"); ; )
          switch (r) {
            case "hex":
              return Lo(
                this,
                e,
                t
              );
            case "utf8":
            case "utf-8":
              return On(this, e, t);
            case "ascii":
              return Po(
                this,
                e,
                t
              );
            case "latin1":
            case "binary":
              return Bo(this, e, t);
            case "base64":
              return To(
                this,
                e,
                t
              );
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Ro(this, e, t);
            default:
              if (n)
                throw new TypeError("Unknown encoding: " + r);
              r = (r + "").toLowerCase(), n = true;
          }
      }
      __name(xo, "xo");
      __name2(xo, "xo");
      a(
        xo,
        "slowToString"
      );
      f.prototype._isBuffer = true;
      function Ee(r, e, t) {
        let n = r[e];
        r[e] = r[t], r[t] = n;
      }
      __name(Ee, "Ee");
      __name2(Ee, "Ee");
      a(Ee, "swap");
      f.prototype.swap16 = a(function() {
        let e = this.length;
        if (e % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let t = 0; t < e; t += 2)
          Ee(this, t, t + 1);
        return this;
      }, "swap16");
      f.prototype.swap32 = a(function() {
        let e = this.length;
        if (e % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let t = 0; t < e; t += 4)
          Ee(this, t, t + 3), Ee(this, t + 1, t + 2);
        return this;
      }, "swap32");
      f.prototype.swap64 = a(function() {
        let e = this.length;
        if (e % 8 !== 0)
          throw new RangeError(
            "Buffer size must be a multiple of 64-bits"
          );
        for (let t = 0; t < e; t += 8)
          Ee(this, t, t + 7), Ee(this, t + 1, t + 6), Ee(this, t + 2, t + 5), Ee(this, t + 3, t + 4);
        return this;
      }, "swap64");
      f.prototype.toString = a(function() {
        let e = this.length;
        return e === 0 ? "" : arguments.length === 0 ? On(
          this,
          0,
          e
        ) : xo.apply(this, arguments);
      }, "toString");
      f.prototype.toLocaleString = f.prototype.toString;
      f.prototype.equals = a(function(e) {
        if (!f.isBuffer(e))
          throw new TypeError(
            "Argument must be a Buffer"
          );
        return this === e ? true : f.compare(this, e) === 0;
      }, "equals");
      f.prototype.inspect = a(function() {
        let e = "", t = Le.INSPECT_MAX_BYTES;
        return e = this.toString(
          "hex",
          0,
          t
        ).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
      }, "inspect");
      Bn && (f.prototype[Bn] = f.prototype.inspect);
      f.prototype.compare = a(function(e, t, n, i, s) {
        if (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)), !f.isBuffer(e))
          throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
        if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length)
          throw new RangeError("out of range index");
        if (i >= s && t >= n)
          return 0;
        if (i >= s)
          return -1;
        if (t >= n)
          return 1;
        if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e)
          return 0;
        let o = s - i, u = n - t, c = Math.min(o, u), h = this.slice(i, s), l = e.slice(t, n);
        for (let d = 0; d < c; ++d)
          if (h[d] !== l[d]) {
            o = h[d], u = l[d];
            break;
          }
        return o < u ? -1 : u < o ? 1 : 0;
      }, "compare");
      function Un(r, e, t, n, i) {
        if (r.length === 0)
          return -1;
        if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, Ot(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
          if (i)
            return -1;
          t = r.length - 1;
        } else if (t < 0)
          if (i)
            t = 0;
          else
            return -1;
        if (typeof e == "string" && (e = f.from(e, n)), f.isBuffer(e))
          return e.length === 0 ? -1 : Ln(r, e, t, n, i);
        if (typeof e == "number")
          return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : Ln(
            r,
            [e],
            t,
            n,
            i
          );
        throw new TypeError("val must be string, number or Buffer");
      }
      __name(Un, "Un");
      __name2(Un, "Un");
      a(Un, "bidirectionalIndexOf");
      function Ln(r, e, t, n, i) {
        let s = 1, o = r.length, u = e.length;
        if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
          if (r.length < 2 || e.length < 2)
            return -1;
          s = 2, o /= 2, u /= 2, t /= 2;
        }
        function c(l, d) {
          return s === 1 ? l[d] : l.readUInt16BE(d * s);
        }
        __name(c, "c");
        __name2(c, "c");
        a(c, "read");
        let h;
        if (i) {
          let l = -1;
          for (h = t; h < o; h++)
            if (c(r, h) === c(e, l === -1 ? 0 : h - l)) {
              if (l === -1 && (l = h), h - l + 1 === u)
                return l * s;
            } else
              l !== -1 && (h -= h - l), l = -1;
        } else
          for (t + u > o && (t = o - u), h = t; h >= 0; h--) {
            let l = true;
            for (let d = 0; d < u; d++)
              if (c(r, h + d) !== c(e, d)) {
                l = false;
                break;
              }
            if (l)
              return h;
          }
        return -1;
      }
      __name(Ln, "Ln");
      __name2(Ln, "Ln");
      a(Ln, "arrayIndexOf");
      f.prototype.includes = a(function(e, t, n) {
        return this.indexOf(e, t, n) !== -1;
      }, "includes");
      f.prototype.indexOf = a(function(e, t, n) {
        return Un(this, e, t, n, true);
      }, "indexOf");
      f.prototype.lastIndexOf = a(function(e, t, n) {
        return Un(this, e, t, n, false);
      }, "lastIndexOf");
      function vo(r, e, t, n) {
        t = Number(t) || 0;
        let i = r.length - t;
        n ? (n = Number(n), n > i && (n = i)) : n = i;
        let s = e.length;
        n > s / 2 && (n = s / 2);
        let o;
        for (o = 0; o < n; ++o) {
          let u = parseInt(e.substr(o * 2, 2), 16);
          if (Ot(u))
            return o;
          r[t + o] = u;
        }
        return o;
      }
      __name(vo, "vo");
      __name2(vo, "vo");
      a(vo, "hexWrite");
      function Eo(r, e, t, n) {
        return st(Mt(
          e,
          r.length - t
        ), r, t, n);
      }
      __name(Eo, "Eo");
      __name2(Eo, "Eo");
      a(Eo, "utf8Write");
      function _o(r, e, t, n) {
        return st(ko(e), r, t, n);
      }
      __name(_o, "_o");
      __name2(_o, "_o");
      a(_o, "asciiWrite");
      function Ao(r, e, t, n) {
        return st(Gn(e), r, t, n);
      }
      __name(Ao, "Ao");
      __name2(Ao, "Ao");
      a(Ao, "base64Write");
      function Co(r, e, t, n) {
        return st(Uo(e, r.length - t), r, t, n);
      }
      __name(Co, "Co");
      __name2(Co, "Co");
      a(Co, "ucs2Write");
      f.prototype.write = a(function(e, t, n, i) {
        if (t === void 0)
          i = "utf8", n = this.length, t = 0;
        else if (n === void 0 && typeof t == "string")
          i = t, n = this.length, t = 0;
        else if (isFinite(t))
          t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
        else
          throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        let s = this.length - t;
        if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length)
          throw new RangeError(
            "Attempt to write outside buffer bounds"
          );
        i || (i = "utf8");
        let o = false;
        for (; ; )
          switch (i) {
            case "hex":
              return vo(this, e, t, n);
            case "utf8":
            case "utf-8":
              return Eo(this, e, t, n);
            case "ascii":
            case "latin1":
            case "binary":
              return _o(this, e, t, n);
            case "base64":
              return Ao(
                this,
                e,
                t,
                n
              );
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return Co(this, e, t, n);
            default:
              if (o)
                throw new TypeError("Unknown encoding: " + i);
              i = ("" + i).toLowerCase(), o = true;
          }
      }, "write");
      f.prototype.toJSON = a(function() {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      }, "toJSON");
      function To(r, e, t) {
        return e === 0 && t === r.length ? Lt.fromByteArray(r) : Lt.fromByteArray(r.slice(e, t));
      }
      __name(To, "To");
      __name2(To, "To");
      a(To, "base64Slice");
      function On(r, e, t) {
        t = Math.min(r.length, t);
        let n = [], i = e;
        for (; i < t; ) {
          let s = r[i], o = null, u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
          if (i + u <= t) {
            let c, h, l, d;
            switch (u) {
              case 1:
                s < 128 && (o = s);
                break;
              case 2:
                c = r[i + 1], (c & 192) === 128 && (d = (s & 31) << 6 | c & 63, d > 127 && (o = d));
                break;
              case 3:
                c = r[i + 1], h = r[i + 2], (c & 192) === 128 && (h & 192) === 128 && (d = (s & 15) << 12 | (c & 63) << 6 | h & 63, d > 2047 && (d < 55296 || d > 57343) && (o = d));
                break;
              case 4:
                c = r[i + 1], h = r[i + 2], l = r[i + 3], (c & 192) === 128 && (h & 192) === 128 && (l & 192) === 128 && (d = (s & 15) << 18 | (c & 63) << 12 | (h & 63) << 6 | l & 63, d > 65535 && d < 1114112 && (o = d));
            }
          }
          o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
        }
        return Io(n);
      }
      __name(On, "On");
      __name2(On, "On");
      a(On, "utf8Slice");
      var Rn = 4096;
      function Io(r) {
        let e = r.length;
        if (e <= Rn)
          return String.fromCharCode.apply(String, r);
        let t = "", n = 0;
        for (; n < e; )
          t += String.fromCharCode.apply(String, r.slice(n, n += Rn));
        return t;
      }
      __name(Io, "Io");
      __name2(Io, "Io");
      a(Io, "decodeCodePointsArray");
      function Po(r, e, t) {
        let n = "";
        t = Math.min(r.length, t);
        for (let i = e; i < t; ++i)
          n += String.fromCharCode(r[i] & 127);
        return n;
      }
      __name(Po, "Po");
      __name2(Po, "Po");
      a(Po, "asciiSlice");
      function Bo(r, e, t) {
        let n = "";
        t = Math.min(r.length, t);
        for (let i = e; i < t; ++i)
          n += String.fromCharCode(r[i]);
        return n;
      }
      __name(Bo, "Bo");
      __name2(Bo, "Bo");
      a(Bo, "latin1Slice");
      function Lo(r, e, t) {
        let n = r.length;
        (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
        let i = "";
        for (let s = e; s < t; ++s)
          i += Oo[r[s]];
        return i;
      }
      __name(Lo, "Lo");
      __name2(Lo, "Lo");
      a(Lo, "hexSlice");
      function Ro(r, e, t) {
        let n = r.slice(e, t), i = "";
        for (let s = 0; s < n.length - 1; s += 2)
          i += String.fromCharCode(n[s] + n[s + 1] * 256);
        return i;
      }
      __name(Ro, "Ro");
      __name2(Ro, "Ro");
      a(Ro, "utf16leSlice");
      f.prototype.slice = a(function(e, t) {
        let n = this.length;
        e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
        let i = this.subarray(
          e,
          t
        );
        return Object.setPrototypeOf(i, f.prototype), i;
      }, "slice");
      function q(r, e, t) {
        if (r % 1 !== 0 || r < 0)
          throw new RangeError("offset is not uint");
        if (r + e > t)
          throw new RangeError(
            "Trying to access beyond buffer length"
          );
      }
      __name(q, "q");
      __name2(q, "q");
      a(q, "checkOffset");
      f.prototype.readUintLE = f.prototype.readUIntLE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = this[e], s = 1, o = 0;
        for (; ++o < t && (s *= 256); )
          i += this[e + o] * s;
        return i;
      }, "readUIntLE");
      f.prototype.readUintBE = f.prototype.readUIntBE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = this[e + --t], s = 1;
        for (; t > 0 && (s *= 256); )
          i += this[e + --t] * s;
        return i;
      }, "readUIntBE");
      f.prototype.readUint8 = f.prototype.readUInt8 = a(function(e, t) {
        return e = e >>> 0, t || q(e, 1, this.length), this[e];
      }, "readUInt8");
      f.prototype.readUint16LE = f.prototype.readUInt16LE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 2, this.length), this[e] | this[e + 1] << 8;
      }, "readUInt16LE");
      f.prototype.readUint16BE = f.prototype.readUInt16BE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 2, this.length), this[e] << 8 | this[e + 1];
      }, "readUInt16BE");
      f.prototype.readUint32LE = f.prototype.readUInt32LE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
      }, "readUInt32LE");
      f.prototype.readUint32BE = f.prototype.readUInt32BE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      }, "readUInt32BE");
      f.prototype.readBigUInt64LE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(e, this.length - 8);
        let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
        return BigInt(i) + (BigInt(s) << BigInt(32));
      }, "readBigUInt64LE"));
      f.prototype.readBigUInt64BE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(e, this.length - 8);
        let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
        return (BigInt(
          i
        ) << BigInt(32)) + BigInt(s);
      }, "readBigUInt64BE"));
      f.prototype.readIntLE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = this[e], s = 1, o = 0;
        for (; ++o < t && (s *= 256); )
          i += this[e + o] * s;
        return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i;
      }, "readIntLE");
      f.prototype.readIntBE = a(function(e, t, n) {
        e = e >>> 0, t = t >>> 0, n || q(e, t, this.length);
        let i = t, s = 1, o = this[e + --i];
        for (; i > 0 && (s *= 256); )
          o += this[e + --i] * s;
        return s *= 128, o >= s && (o -= Math.pow(2, 8 * t)), o;
      }, "readIntBE");
      f.prototype.readInt8 = a(function(e, t) {
        return e = e >>> 0, t || q(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
      }, "readInt8");
      f.prototype.readInt16LE = a(function(e, t) {
        e = e >>> 0, t || q(e, 2, this.length);
        let n = this[e] | this[e + 1] << 8;
        return n & 32768 ? n | 4294901760 : n;
      }, "readInt16LE");
      f.prototype.readInt16BE = a(
        function(e, t) {
          e = e >>> 0, t || q(e, 2, this.length);
          let n = this[e + 1] | this[e] << 8;
          return n & 32768 ? n | 4294901760 : n;
        },
        "readInt16BE"
      );
      f.prototype.readInt32LE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      }, "readInt32LE");
      f.prototype.readInt32BE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      }, "readInt32BE");
      f.prototype.readBigInt64LE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(
          e,
          this.length - 8
        );
        let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
        return (BigInt(
          i
        ) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
      }, "readBigInt64LE"));
      f.prototype.readBigInt64BE = ge(a(function(e) {
        e = e >>> 0, Be(e, "offset");
        let t = this[e], n = this[e + 7];
        (t === void 0 || n === void 0) && We(e, this.length - 8);
        let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
        return (BigInt(i) << BigInt(32)) + BigInt(
          this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n
        );
      }, "readBigInt64BE"));
      f.prototype.readFloatLE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), Pe.read(
          this,
          e,
          true,
          23,
          4
        );
      }, "readFloatLE");
      f.prototype.readFloatBE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 4, this.length), Pe.read(this, e, false, 23, 4);
      }, "readFloatBE");
      f.prototype.readDoubleLE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 8, this.length), Pe.read(this, e, true, 52, 8);
      }, "readDoubleLE");
      f.prototype.readDoubleBE = a(function(e, t) {
        return e = e >>> 0, t || q(e, 8, this.length), Pe.read(this, e, false, 52, 8);
      }, "readDoubleBE");
      function Y(r, e, t, n, i, s) {
        if (!f.isBuffer(
          r
        ))
          throw new TypeError('"buffer" argument must be a Buffer instance');
        if (e > i || e < s)
          throw new RangeError('"value" argument is out of bounds');
        if (t + n > r.length)
          throw new RangeError(
            "Index out of range"
          );
      }
      __name(Y, "Y");
      __name2(Y, "Y");
      a(Y, "checkInt");
      f.prototype.writeUintLE = f.prototype.writeUIntLE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
          let u = Math.pow(2, 8 * n) - 1;
          Y(
            this,
            e,
            t,
            n,
            u,
            0
          );
        }
        let s = 1, o = 0;
        for (this[t] = e & 255; ++o < n && (s *= 256); )
          this[t + o] = e / s & 255;
        return t + n;
      }, "writeUIntLE");
      f.prototype.writeUintBE = f.prototype.writeUIntBE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
          let u = Math.pow(2, 8 * n) - 1;
          Y(this, e, t, n, u, 0);
        }
        let s = n - 1, o = 1;
        for (this[t + s] = e & 255; --s >= 0 && (o *= 256); )
          this[t + s] = e / o & 255;
        return t + n;
      }, "writeUIntBE");
      f.prototype.writeUint8 = f.prototype.writeUInt8 = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
      }, "writeUInt8");
      f.prototype.writeUint16LE = f.prototype.writeUInt16LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          2,
          65535,
          0
        ), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      }, "writeUInt16LE");
      f.prototype.writeUint16BE = f.prototype.writeUInt16BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          2,
          65535,
          0
        ), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      }, "writeUInt16BE");
      f.prototype.writeUint32LE = f.prototype.writeUInt32LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          4,
          4294967295,
          0
        ), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
      }, "writeUInt32LE");
      f.prototype.writeUint32BE = f.prototype.writeUInt32BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      }, "writeUInt32BE");
      function Nn(r, e, t, n, i) {
        Hn(
          e,
          n,
          i,
          r,
          t,
          7
        );
        let s = Number(e & BigInt(4294967295));
        r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
        let o = Number(e >> BigInt(32) & BigInt(4294967295));
        return r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, t;
      }
      __name(Nn, "Nn");
      __name2(Nn, "Nn");
      a(Nn, "wrtBigUInt64LE");
      function qn(r, e, t, n, i) {
        Hn(e, n, i, r, t, 7);
        let s = Number(e & BigInt(4294967295));
        r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
        let o = Number(e >> BigInt(32) & BigInt(4294967295));
        return r[t + 3] = o, o = o >> 8, r[t + 2] = o, o = o >> 8, r[t + 1] = o, o = o >> 8, r[t] = o, t + 8;
      }
      __name(qn, "qn");
      __name2(qn, "qn");
      a(qn, "wrtBigUInt64BE");
      f.prototype.writeBigUInt64LE = ge(a(function(e, t = 0) {
        return Nn(this, e, t, BigInt(0), BigInt(
          "0xffffffffffffffff"
        ));
      }, "writeBigUInt64LE"));
      f.prototype.writeBigUInt64BE = ge(a(function(e, t = 0) {
        return qn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
      }, "writeBigUInt64BE"));
      f.prototype.writeIntLE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, !i) {
          let c = Math.pow(
            2,
            8 * n - 1
          );
          Y(this, e, t, n, c - 1, -c);
        }
        let s = 0, o = 1, u = 0;
        for (this[t] = e & 255; ++s < n && (o *= 256); )
          e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
        return t + n;
      }, "writeIntLE");
      f.prototype.writeIntBE = a(function(e, t, n, i) {
        if (e = +e, t = t >>> 0, !i) {
          let c = Math.pow(
            2,
            8 * n - 1
          );
          Y(this, e, t, n, c - 1, -c);
        }
        let s = n - 1, o = 1, u = 0;
        for (this[t + s] = e & 255; --s >= 0 && (o *= 256); )
          e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
        return t + n;
      }, "writeIntBE");
      f.prototype.writeInt8 = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(
          this,
          e,
          t,
          1,
          127,
          -128
        ), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
      }, "writeInt8");
      f.prototype.writeInt16LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      }, "writeInt16LE");
      f.prototype.writeInt16BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      }, "writeInt16BE");
      f.prototype.writeInt32LE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
      }, "writeInt32LE");
      f.prototype.writeInt32BE = a(function(e, t, n) {
        return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      }, "writeInt32BE");
      f.prototype.writeBigInt64LE = ge(a(function(e, t = 0) {
        return Nn(this, e, t, -BigInt(
          "0x8000000000000000"
        ), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64LE"));
      f.prototype.writeBigInt64BE = ge(a(function(e, t = 0) {
        return qn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64BE"));
      function Qn(r, e, t, n, i, s) {
        if (t + n > r.length)
          throw new RangeError("Index out of range");
        if (t < 0)
          throw new RangeError(
            "Index out of range"
          );
      }
      __name(Qn, "Qn");
      __name2(Qn, "Qn");
      a(Qn, "checkIEEE754");
      function Wn(r, e, t, n, i) {
        return e = +e, t = t >>> 0, i || Qn(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), Pe.write(
          r,
          e,
          t,
          n,
          23,
          4
        ), t + 4;
      }
      __name(Wn, "Wn");
      __name2(Wn, "Wn");
      a(Wn, "writeFloat");
      f.prototype.writeFloatLE = a(function(e, t, n) {
        return Wn(
          this,
          e,
          t,
          true,
          n
        );
      }, "writeFloatLE");
      f.prototype.writeFloatBE = a(function(e, t, n) {
        return Wn(
          this,
          e,
          t,
          false,
          n
        );
      }, "writeFloatBE");
      function jn(r, e, t, n, i) {
        return e = +e, t = t >>> 0, i || Qn(
          r,
          e,
          t,
          8,
          17976931348623157e292,
          -17976931348623157e292
        ), Pe.write(r, e, t, n, 52, 8), t + 8;
      }
      __name(jn, "jn");
      __name2(jn, "jn");
      a(jn, "writeDouble");
      f.prototype.writeDoubleLE = a(function(e, t, n) {
        return jn(
          this,
          e,
          t,
          true,
          n
        );
      }, "writeDoubleLE");
      f.prototype.writeDoubleBE = a(function(e, t, n) {
        return jn(
          this,
          e,
          t,
          false,
          n
        );
      }, "writeDoubleBE");
      f.prototype.copy = a(function(e, t, n, i) {
        if (!f.isBuffer(
          e
        ))
          throw new TypeError("argument should be a Buffer");
        if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0)
          return 0;
        if (t < 0)
          throw new RangeError("targetStart out of bounds");
        if (n < 0 || n >= this.length)
          throw new RangeError("Index out of range");
        if (i < 0)
          throw new RangeError(
            "sourceEnd out of bounds"
          );
        i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
        let s = i - n;
        return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s;
      }, "copy");
      f.prototype.fill = a(function(e, t, n, i) {
        if (typeof e == "string") {
          if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string")
            throw new TypeError("encoding must be a string");
          if (typeof i == "string" && !f.isEncoding(i))
            throw new TypeError("Unknown encoding: " + i);
          if (e.length === 1) {
            let o = e.charCodeAt(0);
            (i === "utf8" && o < 128 || i === "latin1") && (e = o);
          }
        } else
          typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
        if (t < 0 || this.length < t || this.length < n)
          throw new RangeError("Out of range index");
        if (n <= t)
          return this;
        t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
        let s;
        if (typeof e == "number")
          for (s = t; s < n; ++s)
            this[s] = e;
        else {
          let o = f.isBuffer(e) ? e : f.from(e, i), u = o.length;
          if (u === 0)
            throw new TypeError(
              'The value "' + e + '" is invalid for argument "value"'
            );
          for (s = 0; s < n - t; ++s)
            this[s + t] = o[s % u];
        }
        return this;
      }, "fill");
      var Ie = {};
      function Ut(r, e, t) {
        var n;
        Ie[r] = (n = /* @__PURE__ */ __name2(class extends t {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: e.apply(this, arguments),
              writable: true,
              configurable: true
            }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
          }
          get code() {
            return r;
          }
          set code(s) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value: s,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${r}]: ${this.message}`;
          }
        }, "n"), a(n, "NodeError"), n);
      }
      __name(Ut, "Ut");
      __name2(Ut, "Ut");
      a(Ut, "E");
      Ut("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
        return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      }, RangeError);
      Ut("ERR_INVALID_ARG_TYPE", function(r, e) {
        return `The "${r}" argument must be of type number. Received type ${typeof e}`;
      }, TypeError);
      Ut("ERR_OUT_OF_RANGE", function(r, e, t) {
        let n = `The value of "${r}" is out of range.`, i = t;
        return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = Fn(String(t)) : typeof t == "bigint" && (i = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = Fn(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
      }, RangeError);
      function Fn(r) {
        let e = "", t = r.length, n = r[0] === "-" ? 1 : 0;
        for (; t >= n + 4; t -= 3)
          e = `_${r.slice(t - 3, t)}${e}`;
        return `${r.slice(
          0,
          t
        )}${e}`;
      }
      __name(Fn, "Fn");
      __name2(Fn, "Fn");
      a(Fn, "addNumericalSeparator");
      function Fo(r, e, t) {
        Be(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && We(e, r.length - (t + 1));
      }
      __name(Fo, "Fo");
      __name2(Fo, "Fo");
      a(Fo, "checkBounds");
      function Hn(r, e, t, n, i, s) {
        if (r > t || r < e) {
          let o = typeof e == "bigint" ? "n" : "", u;
          throw s > 3 ? e === 0 || e === BigInt(0) ? u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : u = `>= ${e}${o} and <= ${t}${o}`, new Ie.ERR_OUT_OF_RANGE(
            "value",
            u,
            r
          );
        }
        Fo(n, i, s);
      }
      __name(Hn, "Hn");
      __name2(Hn, "Hn");
      a(Hn, "checkIntBI");
      function Be(r, e) {
        if (typeof r != "number")
          throw new Ie.ERR_INVALID_ARG_TYPE(e, "number", r);
      }
      __name(Be, "Be");
      __name2(Be, "Be");
      a(Be, "validateNumber");
      function We(r, e, t) {
        throw Math.floor(r) !== r ? (Be(r, t), new Ie.ERR_OUT_OF_RANGE(
          t || "offset",
          "an integer",
          r
        )) : e < 0 ? new Ie.ERR_BUFFER_OUT_OF_BOUNDS() : new Ie.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, r);
      }
      __name(We, "We");
      __name2(We, "We");
      a(We, "boundsError");
      var Mo = /[^+/0-9A-Za-z-_]/g;
      function Do(r) {
        if (r = r.split("=")[0], r = r.trim().replace(Mo, ""), r.length < 2)
          return "";
        for (; r.length % 4 !== 0; )
          r = r + "=";
        return r;
      }
      __name(Do, "Do");
      __name2(Do, "Do");
      a(Do, "base64clean");
      function Mt(r, e) {
        e = e || 1 / 0;
        let t, n = r.length, i = null, s = [];
        for (let o = 0; o < n; ++o) {
          if (t = r.charCodeAt(o), t > 55295 && t < 57344) {
            if (!i) {
              if (t > 56319) {
                (e -= 3) > -1 && s.push(239, 191, 189);
                continue;
              } else if (o + 1 === n) {
                (e -= 3) > -1 && s.push(239, 191, 189);
                continue;
              }
              i = t;
              continue;
            }
            if (t < 56320) {
              (e -= 3) > -1 && s.push(
                239,
                191,
                189
              ), i = t;
              continue;
            }
            t = (i - 55296 << 10 | t - 56320) + 65536;
          } else
            i && (e -= 3) > -1 && s.push(
              239,
              191,
              189
            );
          if (i = null, t < 128) {
            if ((e -= 1) < 0)
              break;
            s.push(t);
          } else if (t < 2048) {
            if ((e -= 2) < 0)
              break;
            s.push(t >> 6 | 192, t & 63 | 128);
          } else if (t < 65536) {
            if ((e -= 3) < 0)
              break;
            s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
          } else if (t < 1114112) {
            if ((e -= 4) < 0)
              break;
            s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
          } else
            throw new Error("Invalid code point");
        }
        return s;
      }
      __name(Mt, "Mt");
      __name2(Mt, "Mt");
      a(
        Mt,
        "utf8ToBytes"
      );
      function ko(r) {
        let e = [];
        for (let t = 0; t < r.length; ++t)
          e.push(r.charCodeAt(
            t
          ) & 255);
        return e;
      }
      __name(ko, "ko");
      __name2(ko, "ko");
      a(ko, "asciiToBytes");
      function Uo(r, e) {
        let t, n, i, s = [];
        for (let o = 0; o < r.length && !((e -= 2) < 0); ++o)
          t = r.charCodeAt(o), n = t >> 8, i = t % 256, s.push(i), s.push(n);
        return s;
      }
      __name(Uo, "Uo");
      __name2(Uo, "Uo");
      a(Uo, "utf16leToBytes");
      function Gn(r) {
        return Lt.toByteArray(Do(r));
      }
      __name(Gn, "Gn");
      __name2(Gn, "Gn");
      a(Gn, "base64ToBytes");
      function st(r, e, t, n) {
        let i;
        for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
          e[i + t] = r[i];
        return i;
      }
      __name(st, "st");
      __name2(st, "st");
      a(st, "blitBuffer");
      function ue(r, e) {
        return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
      }
      __name(ue, "ue");
      __name2(ue, "ue");
      a(ue, "isInstance");
      function Ot(r) {
        return r !== r;
      }
      __name(Ot, "Ot");
      __name2(Ot, "Ot");
      a(Ot, "numberIsNaN");
      var Oo = function() {
        let r = "0123456789abcdef", e = new Array(256);
        for (let t = 0; t < 16; ++t) {
          let n = t * 16;
          for (let i = 0; i < 16; ++i)
            e[n + i] = r[t] + r[i];
        }
        return e;
      }();
      function ge(r) {
        return typeof BigInt > "u" ? No : r;
      }
      __name(ge, "ge");
      __name2(ge, "ge");
      a(ge, "defineBigIntMethod");
      function No() {
        throw new Error("BigInt not supported");
      }
      __name(No, "No");
      __name2(No, "No");
      a(No, "BufferBigIntNotDefined");
    });
    p = z(() => {
      "use strict";
      S = globalThis, x = globalThis.setImmediate ?? ((r) => setTimeout(
        r,
        0
      )), v = globalThis.clearImmediate ?? ((r) => clearTimeout(r)), g = globalThis.crypto ?? {};
      g.subtle ?? (g.subtle = {});
      y = typeof globalThis.Buffer == "function" && typeof globalThis.Buffer.allocUnsafe == "function" ? globalThis.Buffer : $n().Buffer, m = globalThis.process ?? {};
      m.env ?? (m.env = {});
      try {
        m.nextTick(() => {
        });
      } catch {
        let e = Promise.resolve();
        m.nextTick = e.then.bind(e);
      }
    });
    we = I((Xc, Nt) => {
      "use strict";
      p();
      var Re = typeof Reflect == "object" ? Reflect : null, Vn = Re && typeof Re.apply == "function" ? Re.apply : a(function(e, t, n) {
        return Function.prototype.apply.call(e, t, n);
      }, "ReflectApply"), ot;
      Re && typeof Re.ownKeys == "function" ? ot = Re.ownKeys : Object.getOwnPropertySymbols ? ot = a(function(e) {
        return Object.getOwnPropertyNames(
          e
        ).concat(Object.getOwnPropertySymbols(e));
      }, "ReflectOwnKeys") : ot = a(function(e) {
        return Object.getOwnPropertyNames(e);
      }, "ReflectOwnKeys");
      function qo(r) {
        console && console.warn && console.warn(r);
      }
      __name(qo, "qo");
      __name2(qo, "qo");
      a(qo, "ProcessEmitWarning");
      var zn = Number.isNaN || a(function(e) {
        return e !== e;
      }, "NumberIsNaN");
      function L() {
        L.init.call(this);
      }
      __name(L, "L");
      __name2(L, "L");
      a(L, "EventEmitter");
      Nt.exports = L;
      Nt.exports.once = Ho;
      L.EventEmitter = L;
      L.prototype._events = void 0;
      L.prototype._eventsCount = 0;
      L.prototype._maxListeners = void 0;
      var Kn = 10;
      function at(r) {
        if (typeof r != "function")
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof r);
      }
      __name(at, "at");
      __name2(at, "at");
      a(at, "checkListener");
      Object.defineProperty(L, "defaultMaxListeners", { enumerable: true, get: a(function() {
        return Kn;
      }, "get"), set: a(function(r) {
        if (typeof r != "number" || r < 0 || zn(r))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + r + ".");
        Kn = r;
      }, "set") });
      L.init = function() {
        (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      };
      L.prototype.setMaxListeners = a(
        function(e) {
          if (typeof e != "number" || e < 0 || zn(e))
            throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
          return this._maxListeners = e, this;
        },
        "setMaxListeners"
      );
      function Yn(r) {
        return r._maxListeners === void 0 ? L.defaultMaxListeners : r._maxListeners;
      }
      __name(Yn, "Yn");
      __name2(Yn, "Yn");
      a(Yn, "_getMaxListeners");
      L.prototype.getMaxListeners = a(function() {
        return Yn(this);
      }, "getMaxListeners");
      L.prototype.emit = a(function(e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t.push(arguments[n]);
        var i = e === "error", s = this._events;
        if (s !== void 0)
          i = i && s.error === void 0;
        else if (!i)
          return false;
        if (i) {
          var o;
          if (t.length > 0 && (o = t[0]), o instanceof Error)
            throw o;
          var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
          throw u.context = o, u;
        }
        var c = s[e];
        if (c === void 0)
          return false;
        if (typeof c == "function")
          Vn(c, this, t);
        else
          for (var h = c.length, l = ti(c, h), n = 0; n < h; ++n)
            Vn(
              l[n],
              this,
              t
            );
        return true;
      }, "emit");
      function Zn(r, e, t, n) {
        var i, s, o;
        if (at(t), s = r._events, s === void 0 ? (s = r._events = /* @__PURE__ */ Object.create(null), r._eventsCount = 0) : (s.newListener !== void 0 && (r.emit(
          "newListener",
          e,
          t.listener ? t.listener : t
        ), s = r._events), o = s[e]), o === void 0)
          o = s[e] = t, ++r._eventsCount;
        else if (typeof o == "function" ? o = s[e] = n ? [t, o] : [o, t] : n ? o.unshift(
          t
        ) : o.push(t), i = Yn(r), i > 0 && o.length > i && !o.warned) {
          o.warned = true;
          var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          u.name = "MaxListenersExceededWarning", u.emitter = r, u.type = e, u.count = o.length, qo(u);
        }
        return r;
      }
      __name(Zn, "Zn");
      __name2(Zn, "Zn");
      a(Zn, "_addListener");
      L.prototype.addListener = a(function(e, t) {
        return Zn(this, e, t, false);
      }, "addListener");
      L.prototype.on = L.prototype.addListener;
      L.prototype.prependListener = a(function(e, t) {
        return Zn(this, e, t, true);
      }, "prependListener");
      function Qo() {
        if (!this.fired)
          return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
      }
      __name(Qo, "Qo");
      __name2(Qo, "Qo");
      a(
        Qo,
        "onceWrapper"
      );
      function Jn(r, e, t) {
        var n = {
          fired: false,
          wrapFn: void 0,
          target: r,
          type: e,
          listener: t
        }, i = Qo.bind(n);
        return i.listener = t, n.wrapFn = i, i;
      }
      __name(Jn, "Jn");
      __name2(Jn, "Jn");
      a(Jn, "_onceWrap");
      L.prototype.once = a(function(e, t) {
        return at(t), this.on(e, Jn(this, e, t)), this;
      }, "once");
      L.prototype.prependOnceListener = a(function(e, t) {
        return at(t), this.prependListener(e, Jn(
          this,
          e,
          t
        )), this;
      }, "prependOnceListener");
      L.prototype.removeListener = a(
        function(e, t) {
          var n, i, s, o, u;
          if (at(t), i = this._events, i === void 0)
            return this;
          if (n = i[e], n === void 0)
            return this;
          if (n === t || n.listener === t)
            --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || t));
          else if (typeof n != "function") {
            for (s = -1, o = n.length - 1; o >= 0; o--)
              if (n[o] === t || n[o].listener === t) {
                u = n[o].listener, s = o;
                break;
              }
            if (s < 0)
              return this;
            s === 0 ? n.shift() : Wo(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
          }
          return this;
        },
        "removeListener"
      );
      L.prototype.off = L.prototype.removeListener;
      L.prototype.removeAllListeners = a(function(e) {
        var t, n, i;
        if (n = this._events, n === void 0)
          return this;
        if (n.removeListener === void 0)
          return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
        if (arguments.length === 0) {
          var s = Object.keys(n), o;
          for (i = 0; i < s.length; ++i)
            o = s[i], o !== "removeListener" && this.removeAllListeners(o);
          return this.removeAllListeners(
            "removeListener"
          ), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
        }
        if (t = n[e], typeof t == "function")
          this.removeListener(e, t);
        else if (t !== void 0)
          for (i = t.length - 1; i >= 0; i--)
            this.removeListener(e, t[i]);
        return this;
      }, "removeAllListeners");
      function Xn(r, e, t) {
        var n = r._events;
        if (n === void 0)
          return [];
        var i = n[e];
        return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? jo(i) : ti(i, i.length);
      }
      __name(Xn, "Xn");
      __name2(Xn, "Xn");
      a(Xn, "_listeners");
      L.prototype.listeners = a(function(e) {
        return Xn(this, e, true);
      }, "listeners");
      L.prototype.rawListeners = a(function(e) {
        return Xn(this, e, false);
      }, "rawListeners");
      L.listenerCount = function(r, e) {
        return typeof r.listenerCount == "function" ? r.listenerCount(e) : ei.call(r, e);
      };
      L.prototype.listenerCount = ei;
      function ei(r) {
        var e = this._events;
        if (e !== void 0) {
          var t = e[r];
          if (typeof t == "function")
            return 1;
          if (t !== void 0)
            return t.length;
        }
        return 0;
      }
      __name(ei, "ei");
      __name2(ei, "ei");
      a(ei, "listenerCount");
      L.prototype.eventNames = a(function() {
        return this._eventsCount > 0 ? ot(this._events) : [];
      }, "eventNames");
      function ti(r, e) {
        for (var t = new Array(e), n = 0; n < e; ++n)
          t[n] = r[n];
        return t;
      }
      __name(ti, "ti");
      __name2(ti, "ti");
      a(ti, "arrayClone");
      function Wo(r, e) {
        for (; e + 1 < r.length; e++)
          r[e] = r[e + 1];
        r.pop();
      }
      __name(Wo, "Wo");
      __name2(Wo, "Wo");
      a(Wo, "spliceOne");
      function jo(r) {
        for (var e = new Array(r.length), t = 0; t < e.length; ++t)
          e[t] = r[t].listener || r[t];
        return e;
      }
      __name(jo, "jo");
      __name2(jo, "jo");
      a(jo, "unwrapListeners");
      function Ho(r, e) {
        return new Promise(
          function(t, n) {
            function i(o) {
              r.removeListener(e, s), n(o);
            }
            __name(i, "i");
            __name2(i, "i");
            a(i, "errorListener");
            function s() {
              typeof r.removeListener == "function" && r.removeListener("error", i), t([].slice.call(
                arguments
              ));
            }
            __name(s, "s");
            __name2(s, "s");
            a(s, "resolver"), ri(r, e, s, { once: true }), e !== "error" && Go(r, i, { once: true });
          }
        );
      }
      __name(Ho, "Ho");
      __name2(Ho, "Ho");
      a(Ho, "once");
      function Go(r, e, t) {
        typeof r.on == "function" && ri(r, "error", e, t);
      }
      __name(Go, "Go");
      __name2(Go, "Go");
      a(
        Go,
        "addErrorHandlerIfEventEmitter"
      );
      function ri(r, e, t, n) {
        if (typeof r.on == "function")
          n.once ? r.once(e, t) : r.on(e, t);
        else if (typeof r.addEventListener == "function")
          r.addEventListener(
            e,
            a(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function i(s) {
              n.once && r.removeEventListener(e, i), t(s);
            }, "i"), "i"), "wrapListener")
          );
        else
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof r);
      }
      __name(ri, "ri");
      __name2(ri, "ri");
      a(ri, "eventTargetAgnosticAddListener");
    });
    je = {};
    ie(je, { default: /* @__PURE__ */ __name(() => $o, "default") });
    He = z(() => {
      "use strict";
      p();
      $o = {};
    });
    __name2(Ge, "Ge");
    ni = z(
      () => {
        "use strict";
        p();
        a(Ge, "sha256");
      }
    );
    ii = z(() => {
      "use strict";
      p();
      O = /* @__PURE__ */ __name2(class O2 {
        static {
          __name(this, "O2");
        }
        constructor() {
          _(
            this,
            "_dataLength",
            0
          );
          _(this, "_bufferLength", 0);
          _(this, "_state", new Int32Array(4));
          _(
            this,
            "_buffer",
            new ArrayBuffer(68)
          );
          _(this, "_buffer8");
          _(this, "_buffer32");
          this._buffer8 = new Uint8Array(
            this._buffer,
            0,
            68
          ), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
        }
        static hashByteArray(e, t = false) {
          return this.onePassHasher.start().appendByteArray(e).end(t);
        }
        static hashStr(e, t = false) {
          return this.onePassHasher.start().appendStr(e).end(t);
        }
        static hashAsciiStr(e, t = false) {
          return this.onePassHasher.start().appendAsciiStr(e).end(t);
        }
        static _hex(e) {
          let t = O2.hexChars, n = O2.hexOut, i, s, o, u;
          for (u = 0; u < 4; u += 1)
            for (s = u * 8, i = e[u], o = 0; o < 8; o += 2)
              n[s + 1 + o] = t.charAt(i & 15), i >>>= 4, n[s + 0 + o] = t.charAt(i & 15), i >>>= 4;
          return n.join("");
        }
        static _md5cycle(e, t) {
          let n = e[0], i = e[1], s = e[2], o = e[3];
          n += (i & s | ~i & o) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[1] - 389564586 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[2] + 606105819 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[5] + 1200080426 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[6] - 1473231341 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[9] - 1958414417 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[10] - 42063 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[13] - 40341101 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[14] - 1502002290 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & o | s & ~o) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[6] - 1069501632 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[11] + 643717713 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[10] + 38016083 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[15] - 660478335 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[14] - 1019803690 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[3] - 187363961 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[2] - 51403784 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[7] + 1735328473 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i ^ s ^ o) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[8] - 2022574463 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[11] + 1839030562 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[4] + 1272893353 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[7] - 155497632 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[0] - 358537222 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[3] - 722521979 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[12] - 421815835 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[15] + 530742520 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (s ^ (i | ~o)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[7] + 1126891415 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[14] - 1416354905 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[3] - 1894986606 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[10] - 1051523 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[15] - 30611744 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[6] - 1560198380 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[11] - 1120210379 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[2] + 718787259 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + s | 0, e[0] = n + e[0] | 0, e[1] = i + e[1] | 0, e[2] = s + e[2] | 0, e[3] = o + e[3] | 0;
        }
        start() {
          return this._dataLength = 0, this._bufferLength = 0, this._state.set(O2.stateIdentity), this;
        }
        appendStr(e) {
          let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o;
          for (o = 0; o < e.length; o += 1) {
            if (s = e.charCodeAt(o), s < 128)
              t[i++] = s;
            else if (s < 2048)
              t[i++] = (s >>> 6) + 192, t[i++] = s & 63 | 128;
            else if (s < 55296 || s > 56319)
              t[i++] = (s >>> 12) + 224, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
            else {
              if (s = (s - 55296) * 1024 + (e.charCodeAt(++o) - 56320) + 65536, s > 1114111)
                throw new Error("Unicode standard supports code points up to U+10FFFF");
              t[i++] = (s >>> 18) + 240, t[i++] = s >>> 12 & 63 | 128, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
            }
            i >= 64 && (this._dataLength += 64, O2._md5cycle(this._state, n), i -= 64, n[0] = n[16]);
          }
          return this._bufferLength = i, this;
        }
        appendAsciiStr(e) {
          let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
          for (; ; ) {
            for (s = Math.min(e.length - o, 64 - i); s--; )
              t[i++] = e.charCodeAt(o++);
            if (i < 64)
              break;
            this._dataLength += 64, O2._md5cycle(
              this._state,
              n
            ), i = 0;
          }
          return this._bufferLength = i, this;
        }
        appendByteArray(e) {
          let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
          for (; ; ) {
            for (s = Math.min(e.length - o, 64 - i); s--; )
              t[i++] = e[o++];
            if (i < 64)
              break;
            this._dataLength += 64, O2._md5cycle(
              this._state,
              n
            ), i = 0;
          }
          return this._bufferLength = i, this;
        }
        getState() {
          let e = this._state;
          return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e[0], e[1], e[2], e[3]] };
        }
        setState(e) {
          let t = e.buffer, n = e.state, i = this._state, s;
          for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], s = 0; s < t.length; s += 1)
            this._buffer8[s] = t.charCodeAt(s);
        }
        end(e = false) {
          let t = this._bufferLength, n = this._buffer8, i = this._buffer32, s = (t >> 2) + 1;
          this._dataLength += t;
          let o = this._dataLength * 8;
          if (n[t] = 128, n[t + 1] = n[t + 2] = n[t + 3] = 0, i.set(O2.buffer32Identity.subarray(s), s), t > 55 && (O2._md5cycle(this._state, i), i.set(O2.buffer32Identity)), o <= 4294967295)
            i[14] = o;
          else {
            let u = o.toString(16).match(/(.*?)(.{0,8})$/);
            if (u === null)
              return;
            let c = parseInt(
              u[2],
              16
            ), h = parseInt(u[1], 16) || 0;
            i[14] = c, i[15] = h;
          }
          return O2._md5cycle(this._state, i), e ? this._state : O2._hex(this._state);
        }
      }, "O");
      a(O, "Md5"), _(O, "stateIdentity", new Int32Array(
        [1732584193, -271733879, -1732584194, 271733878]
      )), _(O, "buffer32Identity", new Int32Array(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )), _(O, "hexChars", "0123456789abcdef"), _(O, "hexOut", []), _(O, "onePassHasher", new O());
      $e = O;
    });
    qt = {};
    ie(qt, { createHash: /* @__PURE__ */ __name(() => Ko, "createHash"), createHmac: /* @__PURE__ */ __name(() => zo, "createHmac"), randomBytes: /* @__PURE__ */ __name(() => Vo, "randomBytes") });
    __name2(Vo, "Vo");
    __name2(Ko, "Ko");
    __name2(zo, "zo");
    Qt = z(() => {
      "use strict";
      p();
      ni();
      ii();
      a(Vo, "randomBytes");
      a(Ko, "createHash");
      a(zo, "createHmac");
    });
    jt = I((si) => {
      "use strict";
      p();
      si.parse = function(r, e) {
        return new Wt(r, e).parse();
      };
      var ut = /* @__PURE__ */ __name2(class ut2 {
        static {
          __name(this, "ut2");
        }
        constructor(e, t) {
          this.source = e, this.transform = t || Yo, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
        }
        isEof() {
          return this.position >= this.source.length;
        }
        nextCharacter() {
          var e = this.source[this.position++];
          return e === "\\" ? { value: this.source[this.position++], escaped: true } : { value: e, escaped: false };
        }
        record(e) {
          this.recorded.push(e);
        }
        newEntry(e) {
          var t;
          (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(
            t
          ), this.recorded = []);
        }
        consumeDimensions() {
          if (this.source[0] === "[")
            for (; !this.isEof(); ) {
              var e = this.nextCharacter();
              if (e.value === "=")
                break;
            }
        }
        parse(e) {
          var t, n, i;
          for (this.consumeDimensions(); !this.isEof(); )
            if (t = this.nextCharacter(), t.value === "{" && !i)
              this.dimension++, this.dimension > 1 && (n = new ut2(this.source.substr(this.position - 1), this.transform), this.entries.push(
                n.parse(true)
              ), this.position += n.position - 2);
            else if (t.value === "}" && !i) {
              if (this.dimension--, !this.dimension && (this.newEntry(), e))
                return this.entries;
            } else
              t.value === '"' && !t.escaped ? (i && this.newEntry(true), i = !i) : t.value === "," && !i ? this.newEntry() : this.record(
                t.value
              );
          if (this.dimension !== 0)
            throw new Error("array dimension not balanced");
          return this.entries;
        }
      }, "ut");
      a(ut, "ArrayParser");
      var Wt = ut;
      function Yo(r) {
        return r;
      }
      __name(Yo, "Yo");
      __name2(Yo, "Yo");
      a(Yo, "identity");
    });
    Ht = I((mh, oi) => {
      p();
      var Zo = jt();
      oi.exports = { create: a(function(r, e) {
        return { parse: a(
          function() {
            return Zo.parse(r, e);
          },
          "parse"
        ) };
      }, "create") };
    });
    ci = I((bh, ui) => {
      "use strict";
      p();
      var Jo = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, Xo = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, ea = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, ta = /^-?infinity$/;
      ui.exports = a(function(e) {
        if (ta.test(e))
          return Number(e.replace("i", "I"));
        var t = Jo.exec(e);
        if (!t)
          return ra(e) || null;
        var n = !!t[8], i = parseInt(t[1], 10);
        n && (i = ai(i));
        var s = parseInt(
          t[2],
          10
        ) - 1, o = t[3], u = parseInt(t[4], 10), c = parseInt(t[5], 10), h = parseInt(t[6], 10), l = t[7];
        l = l ? 1e3 * parseFloat(l) : 0;
        var d, b = na(e);
        return b != null ? (d = new Date(Date.UTC(
          i,
          s,
          o,
          u,
          c,
          h,
          l
        )), Gt(i) && d.setUTCFullYear(i), b !== 0 && d.setTime(d.getTime() - b)) : (d = new Date(
          i,
          s,
          o,
          u,
          c,
          h,
          l
        ), Gt(i) && d.setFullYear(i)), d;
      }, "parseDate");
      function ra(r) {
        var e = Xo.exec(r);
        if (e) {
          var t = parseInt(e[1], 10), n = !!e[4];
          n && (t = ai(t));
          var i = parseInt(
            e[2],
            10
          ) - 1, s = e[3], o = new Date(t, i, s);
          return Gt(t) && o.setFullYear(t), o;
        }
      }
      __name(ra, "ra");
      __name2(ra, "ra");
      a(ra, "getDate");
      function na(r) {
        if (r.endsWith("+00"))
          return 0;
        var e = ea.exec(r.split(" ")[1]);
        if (e) {
          var t = e[1];
          if (t === "Z")
            return 0;
          var n = t === "-" ? -1 : 1, i = parseInt(e[2], 10) * 3600 + parseInt(
            e[3] || 0,
            10
          ) * 60 + parseInt(e[4] || 0, 10);
          return i * n * 1e3;
        }
      }
      __name(na, "na");
      __name2(na, "na");
      a(na, "timeZoneOffset");
      function ai(r) {
        return -(r - 1);
      }
      __name(ai, "ai");
      __name2(ai, "ai");
      a(ai, "bcYearToNegativeYear");
      function Gt(r) {
        return r >= 0 && r < 100;
      }
      __name(Gt, "Gt");
      __name2(Gt, "Gt");
      a(
        Gt,
        "is0To99"
      );
    });
    li = I((vh, hi) => {
      p();
      hi.exports = sa;
      var ia = Object.prototype.hasOwnProperty;
      function sa(r) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var n in t)
            ia.call(
              t,
              n
            ) && (r[n] = t[n]);
        }
        return r;
      }
      __name(sa, "sa");
      __name2(sa, "sa");
      a(sa, "extend");
    });
    di = I((Ah, pi) => {
      "use strict";
      p();
      var oa = li();
      pi.exports = Fe;
      function Fe(r) {
        if (!(this instanceof Fe))
          return new Fe(r);
        oa(this, wa(r));
      }
      __name(Fe, "Fe");
      __name2(Fe, "Fe");
      a(Fe, "PostgresInterval");
      var aa = ["seconds", "minutes", "hours", "days", "months", "years"];
      Fe.prototype.toPostgres = function() {
        var r = aa.filter(this.hasOwnProperty, this);
        return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
          var t = this[e] || 0;
          return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(
            /\.?0+$/,
            ""
          )), t + " " + e;
        }, this).join(" ");
      };
      var ua = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, ca = ["years", "months", "days"], ha = ["hours", "minutes", "seconds"];
      Fe.prototype.toISOString = Fe.prototype.toISO = function() {
        var r = ca.map(t, this).join(""), e = ha.map(t, this).join("");
        return "P" + r + "T" + e;
        function t(n) {
          var i = this[n] || 0;
          return n === "seconds" && this.milliseconds && (i = (i + this.milliseconds / 1e3).toFixed(6).replace(
            /0+$/,
            ""
          )), i + ua[n];
        }
        __name(t, "t");
        __name2(t, "t");
      };
      var $t = "([+-]?\\d+)", la = $t + "\\s+years?", fa = $t + "\\s+mons?", pa = $t + "\\s+days?", da = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", ya = new RegExp([
        la,
        fa,
        pa,
        da
      ].map(function(r) {
        return "(" + r + ")?";
      }).join("\\s*")), fi = {
        years: 2,
        months: 4,
        days: 6,
        hours: 9,
        minutes: 10,
        seconds: 11,
        milliseconds: 12
      }, ma = ["hours", "minutes", "seconds", "milliseconds"];
      function ga(r) {
        var e = r + "000000".slice(r.length);
        return parseInt(
          e,
          10
        ) / 1e3;
      }
      __name(ga, "ga");
      __name2(ga, "ga");
      a(ga, "parseMilliseconds");
      function wa(r) {
        if (!r)
          return {};
        var e = ya.exec(
          r
        ), t = e[8] === "-";
        return Object.keys(fi).reduce(function(n, i) {
          var s = fi[i], o = e[s];
          return !o || (o = i === "milliseconds" ? ga(o) : parseInt(o, 10), !o) || (t && ~ma.indexOf(i) && (o *= -1), n[i] = o), n;
        }, {});
      }
      __name(wa, "wa");
      __name2(wa, "wa");
      a(wa, "parse");
    });
    mi = I((Ih, yi) => {
      "use strict";
      p();
      yi.exports = a(function(e) {
        if (/^\\x/.test(e))
          return new y(
            e.substr(2),
            "hex"
          );
        for (var t = "", n = 0; n < e.length; )
          if (e[n] !== "\\")
            t += e[n], ++n;
          else if (/[0-7]{3}/.test(e.substr(n + 1, 3)))
            t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8)), n += 4;
          else {
            for (var i = 1; n + i < e.length && e[n + i] === "\\"; )
              i++;
            for (var s = 0; s < Math.floor(i / 2); ++s)
              t += "\\";
            n += Math.floor(i / 2) * 2;
          }
        return new y(t, "binary");
      }, "parseBytea");
    });
    Ei = I((Lh, vi) => {
      p();
      var Ve = jt(), Ke = Ht(), ct = ci(), wi = di(), bi = mi();
      function ht(r) {
        return a(function(t) {
          return t === null ? t : r(t);
        }, "nullAllowed");
      }
      __name(ht, "ht");
      __name2(ht, "ht");
      a(ht, "allowNull");
      function Si(r) {
        return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
      }
      __name(Si, "Si");
      __name2(Si, "Si");
      a(Si, "parseBool");
      function ba(r) {
        return r ? Ve.parse(r, Si) : null;
      }
      __name(ba, "ba");
      __name2(ba, "ba");
      a(ba, "parseBoolArray");
      function Sa(r) {
        return parseInt(r, 10);
      }
      __name(Sa, "Sa");
      __name2(Sa, "Sa");
      a(Sa, "parseBaseTenInt");
      function Vt(r) {
        return r ? Ve.parse(r, ht(Sa)) : null;
      }
      __name(Vt, "Vt");
      __name2(Vt, "Vt");
      a(Vt, "parseIntegerArray");
      function xa(r) {
        return r ? Ve.parse(r, ht(function(e) {
          return xi(e).trim();
        })) : null;
      }
      __name(xa, "xa");
      __name2(xa, "xa");
      a(xa, "parseBigIntegerArray");
      var va = a(function(r) {
        if (!r)
          return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = Zt(t)), t;
        });
        return e.parse();
      }, "parsePointArray"), Kt = a(function(r) {
        if (!r)
          return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = parseFloat(t)), t;
        });
        return e.parse();
      }, "parseFloatArray"), re = a(function(r) {
        if (!r)
          return null;
        var e = Ke.create(r);
        return e.parse();
      }, "parseStringArray"), zt = a(function(r) {
        if (!r)
          return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = ct(t)), t;
        });
        return e.parse();
      }, "parseDateArray"), Ea = a(function(r) {
        if (!r)
          return null;
        var e = Ke.create(r, function(t) {
          return t !== null && (t = wi(t)), t;
        });
        return e.parse();
      }, "parseIntervalArray"), _a = a(function(r) {
        return r ? Ve.parse(r, ht(bi)) : null;
      }, "parseByteAArray"), Yt = a(function(r) {
        return parseInt(
          r,
          10
        );
      }, "parseInteger"), xi = a(function(r) {
        var e = String(r);
        return /^\d+$/.test(e) ? e : r;
      }, "parseBigInteger"), gi = a(
        function(r) {
          return r ? Ve.parse(r, ht(JSON.parse)) : null;
        },
        "parseJsonArray"
      ), Zt = a(function(r) {
        return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), { x: parseFloat(r[0]), y: parseFloat(r[1]) });
      }, "parsePoint"), Aa = a(function(r) {
        if (r[0] !== "<" && r[1] !== "(")
          return null;
        for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
          if (n || (e += r[i]), r[i] === ")") {
            n = true;
            continue;
          } else if (!n)
            continue;
          r[i] !== "," && (t += r[i]);
        }
        var s = Zt(e);
        return s.radius = parseFloat(t), s;
      }, "parseCircle"), Ca = a(function(r) {
        r(
          20,
          xi
        ), r(21, Yt), r(23, Yt), r(26, Yt), r(700, parseFloat), r(701, parseFloat), r(16, Si), r(
          1082,
          ct
        ), r(1114, ct), r(1184, ct), r(600, Zt), r(651, re), r(718, Aa), r(1e3, ba), r(1001, _a), r(
          1005,
          Vt
        ), r(1007, Vt), r(1028, Vt), r(1016, xa), r(1017, va), r(1021, Kt), r(1022, Kt), r(1231, Kt), r(1014, re), r(1015, re), r(1008, re), r(1009, re), r(1040, re), r(1041, re), r(1115, zt), r(
          1182,
          zt
        ), r(1185, zt), r(1186, wi), r(1187, Ea), r(17, bi), r(114, JSON.parse.bind(JSON)), r(
          3802,
          JSON.parse.bind(JSON)
        ), r(199, gi), r(3807, gi), r(3907, re), r(2951, re), r(791, re), r(
          1183,
          re
        ), r(1270, re);
      }, "init");
      vi.exports = { init: Ca };
    });
    Ai = I((Mh, _i) => {
      "use strict";
      p();
      var Z = 1e6;
      function Ta(r) {
        var e = r.readInt32BE(
          0
        ), t = r.readUInt32BE(4), n = "";
        e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, n = "-");
        var i = "", s, o, u, c, h, l;
        {
          if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0)
            return n + u + i;
          for (c = "", h = 6 - u.length, l = 0; l < h; l++)
            c += "0";
          i = c + u + i;
        }
        {
          if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0)
            return n + u + i;
          for (c = "", h = 6 - u.length, l = 0; l < h; l++)
            c += "0";
          i = c + u + i;
        }
        {
          if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0)
            return n + u + i;
          for (c = "", h = 6 - u.length, l = 0; l < h; l++)
            c += "0";
          i = c + u + i;
        }
        return s = e % Z, o = 4294967296 * s + t, u = "" + o % Z, n + u + i;
      }
      __name(Ta, "Ta");
      __name2(Ta, "Ta");
      a(Ta, "readInt8");
      _i.exports = Ta;
    });
    Bi = I((Uh, Pi) => {
      p();
      var Ia = Ai(), F = a(function(r, e, t, n, i) {
        t = t || 0, n = n || false, i = i || function(C, B, W) {
          return C * Math.pow(2, W) + B;
        };
        var s = t >> 3, o = a(function(C) {
          return n ? ~C & 255 : C;
        }, "inv"), u = 255, c = 8 - t % 8;
        e < c && (u = 255 << 8 - e & 255, c = e), t && (u = u >> t % 8);
        var h = 0;
        t % 8 + e >= 8 && (h = i(0, o(r[s]) & u, c));
        for (var l = e + t >> 3, d = s + 1; d < l; d++)
          h = i(h, o(r[d]), 8);
        var b = (e + t) % 8;
        return b > 0 && (h = i(h, o(r[l]) >> 8 - b, b)), h;
      }, "parseBits"), Ii = a(function(r, e, t) {
        var n = Math.pow(2, t - 1) - 1, i = F(r, 1), s = F(r, t, 1);
        if (s === 0)
          return 0;
        var o = 1, u = a(function(h, l, d) {
          h === 0 && (h = 1);
          for (var b = 1; b <= d; b++)
            o /= 2, (l & 1 << d - b) > 0 && (h += o);
          return h;
        }, "parsePrecisionBits"), c = F(r, e, t + 1, false, u);
        return s == Math.pow(2, t + 1) - 1 ? c === 0 ? i === 0 ? 1 / 0 : -1 / 0 : NaN : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
      }, "parseFloatFromBits"), Pa = a(function(r) {
        return F(r, 1) == 1 ? -1 * (F(r, 15, 1, true) + 1) : F(r, 15, 1);
      }, "parseInt16"), Ci = a(function(r) {
        return F(r, 1) == 1 ? -1 * (F(
          r,
          31,
          1,
          true
        ) + 1) : F(r, 31, 1);
      }, "parseInt32"), Ba = a(function(r) {
        return Ii(r, 23, 8);
      }, "parseFloat32"), La = a(function(r) {
        return Ii(r, 52, 11);
      }, "parseFloat64"), Ra = a(function(r) {
        var e = F(r, 16, 32);
        if (e == 49152)
          return NaN;
        for (var t = Math.pow(1e4, F(r, 16, 16)), n = 0, i = [], s = F(r, 16), o = 0; o < s; o++)
          n += F(r, 16, 64 + 16 * o) * t, t /= 1e4;
        var u = Math.pow(10, F(r, 16, 48));
        return (e === 0 ? 1 : -1) * Math.round(n * u) / u;
      }, "parseNumeric"), Ti = a(function(r, e) {
        var t = F(
          e,
          1
        ), n = F(e, 63, 1), i = new Date((t === 0 ? 1 : -1) * n / 1e3 + 9466848e5);
        return r || i.setTime(i.getTime() + i.getTimezoneOffset() * 6e4), i.usec = n % 1e3, i.getMicroSeconds = function() {
          return this.usec;
        }, i.setMicroSeconds = function(s) {
          this.usec = s;
        }, i.getUTCMicroSeconds = function() {
          return this.usec;
        }, i;
      }, "parseDate"), ze = a(function(r) {
        for (var e = F(r, 32), t = F(r, 32, 32), n = F(r, 32, 64), i = 96, s = [], o = 0; o < e; o++)
          s[o] = F(r, 32, i), i += 32, i += 32;
        var u = a(function(h) {
          var l = F(r, 32, i);
          if (i += 32, l == 4294967295)
            return null;
          var d;
          if (h == 23 || h == 20)
            return d = F(r, l * 8, i), i += l * 8, d;
          if (h == 25)
            return d = r.toString(this.encoding, i >> 3, (i += l << 3) >> 3), d;
          console.log("ERROR: ElementType not implemented: " + h);
        }, "parseElement"), c = a(function(h, l) {
          var d = [], b;
          if (h.length > 1) {
            var C = h.shift();
            for (b = 0; b < C; b++)
              d[b] = c(h, l);
            h.unshift(
              C
            );
          } else
            for (b = 0; b < h[0]; b++)
              d[b] = u(l);
          return d;
        }, "parse");
        return c(s, n);
      }, "parseArray"), Fa = a(function(r) {
        return r.toString("utf8");
      }, "parseText"), Ma = a(function(r) {
        return r === null ? null : F(r, 8) > 0;
      }, "parseBool"), Da = a(function(r) {
        r(20, Ia), r(21, Pa), r(23, Ci), r(
          26,
          Ci
        ), r(1700, Ra), r(700, Ba), r(701, La), r(16, Ma), r(1114, Ti.bind(null, false)), r(1184, Ti.bind(
          null,
          true
        )), r(1e3, ze), r(1007, ze), r(1016, ze), r(1008, ze), r(1009, ze), r(25, Fa);
      }, "init");
      Pi.exports = { init: Da };
    });
    Ri = I((qh, Li) => {
      p();
      Li.exports = {
        BOOL: 16,
        BYTEA: 17,
        CHAR: 18,
        INT8: 20,
        INT2: 21,
        INT4: 23,
        REGPROC: 24,
        TEXT: 25,
        OID: 26,
        TID: 27,
        XID: 28,
        CID: 29,
        JSON: 114,
        XML: 142,
        PG_NODE_TREE: 194,
        SMGR: 210,
        PATH: 602,
        POLYGON: 604,
        CIDR: 650,
        FLOAT4: 700,
        FLOAT8: 701,
        ABSTIME: 702,
        RELTIME: 703,
        TINTERVAL: 704,
        CIRCLE: 718,
        MACADDR8: 774,
        MONEY: 790,
        MACADDR: 829,
        INET: 869,
        ACLITEM: 1033,
        BPCHAR: 1042,
        VARCHAR: 1043,
        DATE: 1082,
        TIME: 1083,
        TIMESTAMP: 1114,
        TIMESTAMPTZ: 1184,
        INTERVAL: 1186,
        TIMETZ: 1266,
        BIT: 1560,
        VARBIT: 1562,
        NUMERIC: 1700,
        REFCURSOR: 1790,
        REGPROCEDURE: 2202,
        REGOPER: 2203,
        REGOPERATOR: 2204,
        REGCLASS: 2205,
        REGTYPE: 2206,
        UUID: 2950,
        TXID_SNAPSHOT: 2970,
        PG_LSN: 3220,
        PG_NDISTINCT: 3361,
        PG_DEPENDENCIES: 3402,
        TSVECTOR: 3614,
        TSQUERY: 3615,
        GTSVECTOR: 3642,
        REGCONFIG: 3734,
        REGDICTIONARY: 3769,
        JSONB: 3802,
        REGNAMESPACE: 4089,
        REGROLE: 4096
      };
    });
    Je = I((Ze) => {
      p();
      var ka = Ei(), Ua = Bi(), Oa = Ht(), Na = Ri();
      Ze.getTypeParser = qa;
      Ze.setTypeParser = Qa;
      Ze.arrayParser = Oa;
      Ze.builtins = Na;
      var Ye = { text: {}, binary: {} };
      function Fi(r) {
        return String(
          r
        );
      }
      __name(Fi, "Fi");
      __name2(Fi, "Fi");
      a(Fi, "noParse");
      function qa(r, e) {
        return e = e || "text", Ye[e] && Ye[e][r] || Fi;
      }
      __name(qa, "qa");
      __name2(qa, "qa");
      a(
        qa,
        "getTypeParser"
      );
      function Qa(r, e, t) {
        typeof e == "function" && (t = e, e = "text"), Ye[e][r] = t;
      }
      __name(Qa, "Qa");
      __name2(Qa, "Qa");
      a(Qa, "setTypeParser");
      ka.init(function(r, e) {
        Ye.text[r] = e;
      });
      Ua.init(function(r, e) {
        Ye.binary[r] = e;
      });
    });
    Xe = I((Gh, Jt) => {
      "use strict";
      p();
      Jt.exports = {
        host: "localhost",
        user: m.platform === "win32" ? m.env.USERNAME : m.env.USER,
        database: void 0,
        password: null,
        connectionString: void 0,
        port: 5432,
        rows: 0,
        binary: false,
        max: 10,
        idleTimeoutMillis: 3e4,
        client_encoding: "",
        ssl: false,
        application_name: void 0,
        fallback_application_name: void 0,
        options: void 0,
        parseInputDatesAsUTC: false,
        statement_timeout: false,
        lock_timeout: false,
        idle_in_transaction_session_timeout: false,
        query_timeout: false,
        connect_timeout: 0,
        keepalives: 1,
        keepalives_idle: 0
      };
      var Me = Je(), Wa = Me.getTypeParser(
        20,
        "text"
      ), ja = Me.getTypeParser(1016, "text");
      Jt.exports.__defineSetter__("parseInt8", function(r) {
        Me.setTypeParser(20, "text", r ? Me.getTypeParser(23, "text") : Wa), Me.setTypeParser(1016, "text", r ? Me.getTypeParser(1007, "text") : ja);
      });
    });
    et = I((Vh, Di) => {
      "use strict";
      p();
      var Ha = (Qt(), N(qt)), Ga = Xe();
      function $a(r) {
        var e = r.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        return '"' + e + '"';
      }
      __name($a, "$a");
      __name2($a, "$a");
      a($a, "escapeElement");
      function Mi(r) {
        for (var e = "{", t = 0; t < r.length; t++)
          t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + Mi(r[t]) : r[t] instanceof y ? e += "\\\\x" + r[t].toString("hex") : e += $a(lt(r[t]));
        return e = e + "}", e;
      }
      __name(Mi, "Mi");
      __name2(Mi, "Mi");
      a(Mi, "arrayString");
      var lt = a(function(r, e) {
        if (r == null)
          return null;
        if (r instanceof y)
          return r;
        if (ArrayBuffer.isView(r)) {
          var t = y.from(r.buffer, r.byteOffset, r.byteLength);
          return t.length === r.byteLength ? t : t.slice(
            r.byteOffset,
            r.byteOffset + r.byteLength
          );
        }
        return r instanceof Date ? Ga.parseInputDatesAsUTC ? za(r) : Ka(r) : Array.isArray(r) ? Mi(r) : typeof r == "object" ? Va(r, e) : r.toString();
      }, "prepareValue");
      function Va(r, e) {
        if (r && typeof r.toPostgres == "function") {
          if (e = e || [], e.indexOf(r) !== -1)
            throw new Error('circular reference detected while preparing "' + r + '" for query');
          return e.push(r), lt(r.toPostgres(lt), e);
        }
        return JSON.stringify(r);
      }
      __name(Va, "Va");
      __name2(Va, "Va");
      a(Va, "prepareObject");
      function H(r, e) {
        for (r = "" + r; r.length < e; )
          r = "0" + r;
        return r;
      }
      __name(H, "H");
      __name2(H, "H");
      a(
        H,
        "pad"
      );
      function Ka(r) {
        var e = -r.getTimezoneOffset(), t = r.getFullYear(), n = t < 1;
        n && (t = Math.abs(t) + 1);
        var i = H(t, 4) + "-" + H(r.getMonth() + 1, 2) + "-" + H(r.getDate(), 2) + "T" + H(r.getHours(), 2) + ":" + H(r.getMinutes(), 2) + ":" + H(r.getSeconds(), 2) + "." + H(
          r.getMilliseconds(),
          3
        );
        return e < 0 ? (i += "-", e *= -1) : i += "+", i += H(Math.floor(e / 60), 2) + ":" + H(e % 60, 2), n && (i += " BC"), i;
      }
      __name(Ka, "Ka");
      __name2(Ka, "Ka");
      a(Ka, "dateToString");
      function za(r) {
        var e = r.getUTCFullYear(), t = e < 1;
        t && (e = Math.abs(e) + 1);
        var n = H(e, 4) + "-" + H(r.getUTCMonth() + 1, 2) + "-" + H(r.getUTCDate(), 2) + "T" + H(r.getUTCHours(), 2) + ":" + H(r.getUTCMinutes(), 2) + ":" + H(r.getUTCSeconds(), 2) + "." + H(r.getUTCMilliseconds(), 3);
        return n += "+00:00", t && (n += " BC"), n;
      }
      __name(za, "za");
      __name2(za, "za");
      a(za, "dateToStringUTC");
      function Ya(r, e, t) {
        return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
      }
      __name(Ya, "Ya");
      __name2(Ya, "Ya");
      a(Ya, "normalizeQueryConfig");
      var Xt = a(function(r) {
        return Ha.createHash("md5").update(r, "utf-8").digest("hex");
      }, "md5"), Za = a(function(r, e, t) {
        var n = Xt(e + r), i = Xt(y.concat([y.from(n), t]));
        return "md5" + i;
      }, "postgresMd5PasswordHash");
      Di.exports = { prepareValue: a(function(e) {
        return lt(
          e
        );
      }, "prepareValueWrapper"), normalizeQueryConfig: Ya, postgresMd5PasswordHash: Za, md5: Xt };
    });
    qi = I((Yh, Ni) => {
      "use strict";
      p();
      var er = (Qt(), N(qt));
      function Ja(r) {
        if (r.indexOf(
          "SCRAM-SHA-256"
        ) === -1)
          throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
        let e = er.randomBytes(18).toString("base64");
        return { mechanism: "SCRAM-SHA-256", clientNonce: e, response: "n,,n=*,r=" + e, message: "SASLInitialResponse" };
      }
      __name(Ja, "Ja");
      __name2(Ja, "Ja");
      a(Ja, "startSession");
      function Xa(r, e, t) {
        if (r.message !== "SASLInitialResponse")
          throw new Error(
            "SASL: Last message was not SASLInitialResponse"
          );
        if (typeof e != "string")
          throw new Error(
            "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
          );
        if (typeof t != "string")
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
        let n = ru(t);
        if (n.nonce.startsWith(r.clientNonce)) {
          if (n.nonce.length === r.clientNonce.length)
            throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
        } else
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
        var i = y.from(n.salt, "base64"), s = su(
          e,
          i,
          n.iteration
        ), o = De(s, "Client Key"), u = iu(o), c = "n=*,r=" + r.clientNonce, h = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration, l = "c=biws,r=" + n.nonce, d = c + "," + h + "," + l, b = De(u, d), C = Oi(
          o,
          b
        ), B = C.toString("base64"), W = De(s, "Server Key"), X = De(W, d);
        r.message = "SASLResponse", r.serverSignature = X.toString("base64"), r.response = l + ",p=" + B;
      }
      __name(Xa, "Xa");
      __name2(Xa, "Xa");
      a(Xa, "continueSession");
      function eu(r, e) {
        if (r.message !== "SASLResponse")
          throw new Error("SASL: Last message was not SASLResponse");
        if (typeof e != "string")
          throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
        let { serverSignature: t } = nu(
          e
        );
        if (t !== r.serverSignature)
          throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
      }
      __name(eu, "eu");
      __name2(eu, "eu");
      a(eu, "finalizeSession");
      function tu(r) {
        if (typeof r != "string")
          throw new TypeError("SASL: text must be a string");
        return r.split("").map(
          (e, t) => r.charCodeAt(t)
        ).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
      }
      __name(tu, "tu");
      __name2(tu, "tu");
      a(tu, "isPrintableChars");
      function ki(r) {
        return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
      }
      __name(ki, "ki");
      __name2(ki, "ki");
      a(ki, "isBase64");
      function Ui(r) {
        if (typeof r != "string")
          throw new TypeError(
            "SASL: attribute pairs text must be a string"
          );
        return new Map(r.split(",").map((e) => {
          if (!/^.=/.test(e))
            throw new Error("SASL: Invalid attribute pair entry");
          let t = e[0], n = e.substring(2);
          return [t, n];
        }));
      }
      __name(Ui, "Ui");
      __name2(Ui, "Ui");
      a(Ui, "parseAttributePairs");
      function ru(r) {
        let e = Ui(
          r
        ), t = e.get("r");
        if (t) {
          if (!tu(t))
            throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
        } else
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
        let n = e.get("s");
        if (n) {
          if (!ki(n))
            throw new Error(
              "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64"
            );
        } else
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
        let i = e.get("i");
        if (i) {
          if (!/^[1-9][0-9]*$/.test(i))
            throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
        } else
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
        let s = parseInt(i, 10);
        return { nonce: t, salt: n, iteration: s };
      }
      __name(ru, "ru");
      __name2(ru, "ru");
      a(ru, "parseServerFirstMessage");
      function nu(r) {
        let t = Ui(r).get("v");
        if (t) {
          if (!ki(t))
            throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
        } else
          throw new Error(
            "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing"
          );
        return { serverSignature: t };
      }
      __name(nu, "nu");
      __name2(nu, "nu");
      a(nu, "parseServerFinalMessage");
      function Oi(r, e) {
        if (!y.isBuffer(r))
          throw new TypeError(
            "first argument must be a Buffer"
          );
        if (!y.isBuffer(e))
          throw new TypeError("second argument must be a Buffer");
        if (r.length !== e.length)
          throw new Error("Buffer lengths must match");
        if (r.length === 0)
          throw new Error("Buffers cannot be empty");
        return y.from(r.map((t, n) => r[n] ^ e[n]));
      }
      __name(Oi, "Oi");
      __name2(Oi, "Oi");
      a(Oi, "xorBuffers");
      function iu(r) {
        return er.createHash(
          "sha256"
        ).update(r).digest();
      }
      __name(iu, "iu");
      __name2(iu, "iu");
      a(iu, "sha256");
      function De(r, e) {
        return er.createHmac(
          "sha256",
          r
        ).update(e).digest();
      }
      __name(De, "De");
      __name2(De, "De");
      a(De, "hmacSha256");
      function su(r, e, t) {
        for (var n = De(
          r,
          y.concat([e, y.from([0, 0, 0, 1])])
        ), i = n, s = 0; s < t - 1; s++)
          n = De(r, n), i = Oi(i, n);
        return i;
      }
      __name(su, "su");
      __name2(su, "su");
      a(su, "Hi");
      Ni.exports = { startSession: Ja, continueSession: Xa, finalizeSession: eu };
    });
    tr = {};
    ie(tr, { join: /* @__PURE__ */ __name(() => ou, "join") });
    __name2(ou, "ou");
    rr = z(() => {
      "use strict";
      p();
      a(ou, "join");
    });
    nr = {};
    ie(nr, { stat: /* @__PURE__ */ __name(() => au, "stat") });
    __name2(au, "au");
    ir = z(
      () => {
        "use strict";
        p();
        a(au, "stat");
      }
    );
    sr = {};
    ie(sr, { default: /* @__PURE__ */ __name(() => uu, "default") });
    or = z(() => {
      "use strict";
      p();
      uu = {};
    });
    Qi = {};
    ie(Qi, { StringDecoder: /* @__PURE__ */ __name(() => ar, "StringDecoder") });
    Wi = z(() => {
      "use strict";
      p();
      ur = /* @__PURE__ */ __name2(class ur {
        static {
          __name(this, "ur");
        }
        constructor(e) {
          _(this, "td");
          this.td = new TextDecoder(e);
        }
        write(e) {
          return this.td.decode(e, { stream: true });
        }
        end(e) {
          return this.td.decode(e);
        }
      }, "ur");
      a(ur, "StringDecoder");
      ar = ur;
    });
    $i = I((ol, Gi) => {
      "use strict";
      p();
      var { Transform: cu } = (or(), N(sr)), { StringDecoder: hu } = (Wi(), N(Qi)), be = Symbol("last"), ft = Symbol("decoder");
      function lu(r, e, t) {
        let n;
        if (this.overflow) {
          if (n = this[ft].write(r).split(this.matcher), n.length === 1)
            return t();
          n.shift(), this.overflow = false;
        } else
          this[be] += this[ft].write(r), n = this[be].split(this.matcher);
        this[be] = n.pop();
        for (let i = 0; i < n.length; i++)
          try {
            Hi(this, this.mapper(n[i]));
          } catch (s) {
            return t(
              s
            );
          }
        if (this.overflow = this[be].length > this.maxLength, this.overflow && !this.skipOverflow) {
          t(new Error("maximum buffer reached"));
          return;
        }
        t();
      }
      __name(lu, "lu");
      __name2(lu, "lu");
      a(lu, "transform");
      function fu(r) {
        if (this[be] += this[ft].end(), this[be])
          try {
            Hi(this, this.mapper(this[be]));
          } catch (e) {
            return r(e);
          }
        r();
      }
      __name(fu, "fu");
      __name2(fu, "fu");
      a(fu, "flush");
      function Hi(r, e) {
        e !== void 0 && r.push(e);
      }
      __name(Hi, "Hi");
      __name2(Hi, "Hi");
      a(Hi, "push");
      function ji(r) {
        return r;
      }
      __name(ji, "ji");
      __name2(ji, "ji");
      a(ji, "noop");
      function pu(r, e, t) {
        switch (r = r || /\r?\n/, e = e || ji, t = t || {}, arguments.length) {
          case 1:
            typeof r == "function" ? (e = r, r = /\r?\n/) : typeof r == "object" && !(r instanceof RegExp) && !r[Symbol.split] && (t = r, r = /\r?\n/);
            break;
          case 2:
            typeof r == "function" ? (t = e, e = r, r = /\r?\n/) : typeof e == "object" && (t = e, e = ji);
        }
        t = Object.assign({}, t), t.autoDestroy = true, t.transform = lu, t.flush = fu, t.readableObjectMode = true;
        let n = new cu(t);
        return n[be] = "", n[ft] = new hu("utf8"), n.matcher = r, n.mapper = e, n.maxLength = t.maxLength, n.skipOverflow = t.skipOverflow || false, n.overflow = false, n._destroy = function(i, s) {
          this._writableState.errorEmitted = false, s(i);
        }, n;
      }
      __name(pu, "pu");
      __name2(pu, "pu");
      a(pu, "split");
      Gi.exports = pu;
    });
    zi = I((cl, pe) => {
      "use strict";
      p();
      var Vi = (rr(), N(tr)), du = (or(), N(sr)).Stream, yu = $i(), Ki = (He(), N(je)), mu = 5432, pt = m.platform === "win32", tt = m.stderr, gu = 56, wu = 7, bu = 61440, Su = 32768;
      function xu(r) {
        return (r & bu) == Su;
      }
      __name(xu, "xu");
      __name2(xu, "xu");
      a(xu, "isRegFile");
      var ke = [
        "host",
        "port",
        "database",
        "user",
        "password"
      ], cr = ke.length, vu = ke[cr - 1];
      function hr() {
        var r = tt instanceof du && tt.writable === true;
        if (r) {
          var e = Array.prototype.slice.call(arguments).concat(`
`);
          tt.write(Ki.format.apply(Ki, e));
        }
      }
      __name(hr, "hr");
      __name2(hr, "hr");
      a(hr, "warn");
      Object.defineProperty(
        pe.exports,
        "isWin",
        { get: a(function() {
          return pt;
        }, "get"), set: a(function(r) {
          pt = r;
        }, "set") }
      );
      pe.exports.warnTo = function(r) {
        var e = tt;
        return tt = r, e;
      };
      pe.exports.getFileName = function(r) {
        var e = r || m.env, t = e.PGPASSFILE || (pt ? Vi.join(e.APPDATA || "./", "postgresql", "pgpass.conf") : Vi.join(e.HOME || "./", ".pgpass"));
        return t;
      };
      pe.exports.usePgPass = function(r, e) {
        return Object.prototype.hasOwnProperty.call(m.env, "PGPASSWORD") ? false : pt ? true : (e = e || "<unkn>", xu(r.mode) ? r.mode & (gu | wu) ? (hr('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', e), false) : true : (hr('WARNING: password file "%s" is not a plain file', e), false));
      };
      var Eu = pe.exports.match = function(r, e) {
        return ke.slice(0, -1).reduce(function(t, n, i) {
          return i == 1 && Number(r[n] || mu) === Number(
            e[n]
          ) ? t && true : t && (e[n] === "*" || e[n] === r[n]);
        }, true);
      };
      pe.exports.getPassword = function(r, e, t) {
        var n, i = e.pipe(yu());
        function s(c) {
          var h = _u(c);
          h && Au(h) && Eu(r, h) && (n = h[vu], i.end());
        }
        __name(s, "s");
        __name2(s, "s");
        a(s, "onLine");
        var o = a(function() {
          e.destroy(), t(n);
        }, "onEnd"), u = a(function(c) {
          e.destroy(), hr("WARNING: error on reading file: %s", c), t(void 0);
        }, "onErr");
        e.on("error", u), i.on("data", s).on("end", o).on("error", u);
      };
      var _u = pe.exports.parseLine = function(r) {
        if (r.length < 11 || r.match(/^\s+#/))
          return null;
        for (var e = "", t = "", n = 0, i = 0, s = 0, o = {}, u = false, c = a(function(l, d, b) {
          var C = r.substring(d, b);
          Object.hasOwnProperty.call(
            m.env,
            "PGPASS_NO_DEESCAPE"
          ) || (C = C.replace(/\\([:\\])/g, "$1")), o[ke[l]] = C;
        }, "addToObj"), h = 0; h < r.length - 1; h += 1) {
          if (e = r.charAt(h + 1), t = r.charAt(h), u = n == cr - 1, u) {
            c(n, i);
            break;
          }
          h >= 0 && e == ":" && t !== "\\" && (c(n, i, h + 1), i = h + 2, n += 1);
        }
        return o = Object.keys(o).length === cr ? o : null, o;
      }, Au = pe.exports.isValidEntry = function(r) {
        for (var e = { 0: function(o) {
          return o.length > 0;
        }, 1: function(o) {
          return o === "*" ? true : (o = Number(o), isFinite(o) && o > 0 && o < 9007199254740992 && Math.floor(o) === o);
        }, 2: function(o) {
          return o.length > 0;
        }, 3: function(o) {
          return o.length > 0;
        }, 4: function(o) {
          return o.length > 0;
        } }, t = 0; t < ke.length; t += 1) {
          var n = e[t], i = r[ke[t]] || "", s = n(i);
          if (!s)
            return false;
        }
        return true;
      };
    });
    Zi = I((pl, lr) => {
      "use strict";
      p();
      var fl = (rr(), N(tr)), Yi = (ir(), N(nr)), dt = zi();
      lr.exports = function(r, e) {
        var t = dt.getFileName();
        Yi.stat(t, function(n, i) {
          if (n || !dt.usePgPass(i, t))
            return e(void 0);
          var s = Yi.createReadStream(t);
          dt.getPassword(
            r,
            s,
            e
          );
        });
      };
      lr.exports.warnTo = dt.warnTo;
    });
    mt = I((yl, Ji) => {
      "use strict";
      p();
      var Cu = Je();
      function yt(r) {
        this._types = r || Cu, this.text = {}, this.binary = {};
      }
      __name(yt, "yt");
      __name2(yt, "yt");
      a(yt, "TypeOverrides");
      yt.prototype.getOverrides = function(r) {
        switch (r) {
          case "text":
            return this.text;
          case "binary":
            return this.binary;
          default:
            return {};
        }
      };
      yt.prototype.setTypeParser = function(r, e, t) {
        typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
      };
      yt.prototype.getTypeParser = function(r, e) {
        return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
      };
      Ji.exports = yt;
    });
    Xi = {};
    ie(Xi, { default: /* @__PURE__ */ __name(() => Tu, "default") });
    es = z(() => {
      "use strict";
      p();
      Tu = {};
    });
    ts = {};
    ie(ts, { parse: /* @__PURE__ */ __name(() => fr, "parse") });
    __name2(fr, "fr");
    pr = z(() => {
      "use strict";
      p();
      a(fr, "parse");
    });
    ns = I((xl, rs) => {
      "use strict";
      p();
      var Iu = (pr(), N(ts)), dr = (ir(), N(nr));
      function yr(r) {
        if (r.charAt(0) === "/") {
          var t = r.split(" ");
          return { host: t[0], database: t[1] };
        }
        var e = Iu.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) ? encodeURI(r).replace(
          /\%25(\d\d)/g,
          "%$1"
        ) : r, true), t = e.query;
        for (var n in t)
          Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
        var i = (e.auth || ":").split(":");
        if (t.user = i[0], t.password = i.splice(1).join(":"), t.port = e.port, e.protocol == "socket:")
          return t.host = decodeURI(e.pathname), t.database = e.query.db, t.client_encoding = e.query.encoding, t;
        t.host || (t.host = e.hostname);
        var s = e.pathname;
        if (!t.host && s && /^%2f/i.test(s)) {
          var o = s.split("/");
          t.host = decodeURIComponent(
            o[0]
          ), s = o.splice(1).join("/");
        }
        switch (s && s.charAt(0) === "/" && (s = s.slice(1) || null), t.database = s && decodeURI(s), (t.ssl === "true" || t.ssl === "1") && (t.ssl = true), t.ssl === "0" && (t.ssl = false), (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) && (t.ssl = {}), t.sslcert && (t.ssl.cert = dr.readFileSync(t.sslcert).toString()), t.sslkey && (t.ssl.key = dr.readFileSync(
          t.sslkey
        ).toString()), t.sslrootcert && (t.ssl.ca = dr.readFileSync(t.sslrootcert).toString()), t.sslmode) {
          case "disable": {
            t.ssl = false;
            break;
          }
          case "prefer":
          case "require":
          case "verify-ca":
          case "verify-full":
            break;
          case "no-verify": {
            t.ssl.rejectUnauthorized = false;
            break;
          }
        }
        return t;
      }
      __name(yr, "yr");
      __name2(yr, "yr");
      a(yr, "parse");
      rs.exports = yr;
      yr.parse = yr;
    });
    gt = I((_l, os) => {
      "use strict";
      p();
      var Pu = (es(), N(Xi)), ss = Xe(), is = ns().parse, $ = a(
        function(r, e, t) {
          return t === void 0 ? t = m.env["PG" + r.toUpperCase()] : t === false || (t = m.env[t]), e[r] || t || ss[r];
        },
        "val"
      ), Bu = a(function() {
        switch (m.env.PGSSLMODE) {
          case "disable":
            return false;
          case "prefer":
          case "require":
          case "verify-ca":
          case "verify-full":
            return true;
          case "no-verify":
            return { rejectUnauthorized: false };
        }
        return ss.ssl;
      }, "readSSLConfigFromEnvironment"), Ue = a(
        function(r) {
          return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
        },
        "quoteParamValue"
      ), ne = a(function(r, e, t) {
        var n = e[t];
        n != null && r.push(t + "=" + Ue(n));
      }, "add"), gr = /* @__PURE__ */ __name2(class gr {
        static {
          __name(this, "gr");
        }
        constructor(e) {
          e = typeof e == "string" ? is(e) : e || {}, e.connectionString && (e = Object.assign({}, e, is(e.connectionString))), this.user = $("user", e), this.database = $("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(
            $("port", e),
            10
          ), this.host = $("host", e), Object.defineProperty(this, "password", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: $("password", e)
          }), this.binary = $("binary", e), this.options = $("options", e), this.ssl = typeof e.ssl > "u" ? Bu() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = true), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = $("client_encoding", e), this.replication = $("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = $("application_name", e, "PGAPPNAME"), this.fallback_application_name = $("fallback_application_name", e, false), this.statement_timeout = $("statement_timeout", e, false), this.lock_timeout = $(
            "lock_timeout",
            e,
            false
          ), this.idle_in_transaction_session_timeout = $("idle_in_transaction_session_timeout", e, false), this.query_timeout = $("query_timeout", e, false), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = m.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === false ? this.keepalives = 0 : e.keepAlive === true && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
        }
        getLibpqConnectionString(e) {
          var t = [];
          ne(t, this, "user"), ne(t, this, "password"), ne(t, this, "port"), ne(t, this, "application_name"), ne(t, this, "fallback_application_name"), ne(t, this, "connect_timeout"), ne(
            t,
            this,
            "options"
          );
          var n = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
          if (ne(t, n, "sslmode"), ne(t, n, "sslca"), ne(t, n, "sslkey"), ne(t, n, "sslcert"), ne(t, n, "sslrootcert"), this.database && t.push("dbname=" + Ue(this.database)), this.replication && t.push("replication=" + Ue(this.replication)), this.host && t.push("host=" + Ue(this.host)), this.isDomainSocket)
            return e(null, t.join(" "));
          this.client_encoding && t.push("client_encoding=" + Ue(this.client_encoding)), Pu.lookup(this.host, function(i, s) {
            return i ? e(i, null) : (t.push("hostaddr=" + Ue(s)), e(null, t.join(" ")));
          });
        }
      }, "gr");
      a(gr, "ConnectionParameters");
      var mr = gr;
      os.exports = mr;
    });
    cs = I((Tl, us) => {
      "use strict";
      p();
      var Lu = Je(), as = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, br = /* @__PURE__ */ __name2(class br {
        static {
          __name(this, "br");
        }
        constructor(e, t) {
          this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray);
        }
        addCommandComplete(e) {
          var t;
          e.text ? t = as.exec(e.text) : t = as.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(t[2], 10), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(
            t[2],
            10
          )));
        }
        _parseRowAsArray(e) {
          for (var t = new Array(e.length), n = 0, i = e.length; n < i; n++) {
            var s = e[n];
            s !== null ? t[n] = this._parsers[n](s) : t[n] = null;
          }
          return t;
        }
        parseRow(e) {
          for (var t = {}, n = 0, i = e.length; n < i; n++) {
            var s = e[n], o = this.fields[n].name;
            s !== null ? t[o] = this._parsers[n](
              s
            ) : t[o] = null;
          }
          return t;
        }
        addRow(e) {
          this.rows.push(e);
        }
        addFields(e) {
          this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            this._types ? this._parsers[t] = this._types.getTypeParser(n.dataTypeID, n.format || "text") : this._parsers[t] = Lu.getTypeParser(n.dataTypeID, n.format || "text");
          }
        }
      }, "br");
      a(br, "Result");
      var wr = br;
      us.exports = wr;
    });
    ps = I((Bl, fs) => {
      "use strict";
      p();
      var { EventEmitter: Ru } = we(), hs = cs(), ls = et(), xr = /* @__PURE__ */ __name2(class xr extends Ru {
        static {
          __name(this, "xr");
        }
        constructor(e, t, n) {
          super(), e = ls.normalizeQueryConfig(e, t, n), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, m.domain && e.callback && (this.callback = m.domain.bind(e.callback)), this._result = new hs(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
        }
        requiresPreparation() {
          return this.name || this.rows ? true : !this.text || !this.values ? false : this.values.length > 0;
        }
        _checkForMultirow() {
          this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new hs(
            this._rowMode,
            this.types
          ), this._results.push(this._result));
        }
        handleRowDescription(e) {
          this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
        }
        handleDataRow(e) {
          let t;
          if (!this._canceledDueToError) {
            try {
              t = this._result.parseRow(e.fields);
            } catch (n) {
              this._canceledDueToError = n;
              return;
            }
            this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
          }
        }
        handleCommandComplete(e, t) {
          this._checkForMultirow(), this._result.addCommandComplete(e), this.rows && t.sync();
        }
        handleEmptyQuery(e) {
          this.rows && e.sync();
        }
        handleError(e, t) {
          if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = false), this.callback)
            return this.callback(e);
          this.emit("error", e);
        }
        handleReadyForQuery(e) {
          if (this._canceledDueToError)
            return this.handleError(
              this._canceledDueToError,
              e
            );
          if (this.callback)
            try {
              this.callback(null, this._results);
            } catch (t) {
              m.nextTick(() => {
                throw t;
              });
            }
          this.emit("end", this._results);
        }
        submit(e) {
          if (typeof this.text != "string" && typeof this.name != "string")
            return new Error("A query must have either text or a name. Supplying neither is unsupported.");
          let t = e.parsedStatements[this.name];
          return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
        }
        hasBeenParsed(e) {
          return this.name && e.parsedStatements[this.name];
        }
        handlePortalSuspended(e) {
          this._getRows(e, this.rows);
        }
        _getRows(e, t) {
          e.execute(
            { portal: this.portal, rows: t }
          ), t ? e.flush() : e.sync();
        }
        prepare(e) {
          this.isPreparedStatement = true, this.hasBeenParsed(e) || e.parse({ text: this.text, name: this.name, types: this.types });
          try {
            e.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: ls.prepareValue });
          } catch (t) {
            this.handleError(t, e);
            return;
          }
          e.describe(
            { type: "P", name: this.portal || "" }
          ), this._getRows(e, this.rows);
        }
        handleCopyInResponse(e) {
          e.sendCopyFail("No source stream defined");
        }
        handleCopyData(e, t) {
        }
      }, "xr");
      a(xr, "Query");
      var Sr = xr;
      fs.exports = Sr;
    });
    ys = {};
    ie(ys, { Socket: /* @__PURE__ */ __name(() => _e, "Socket"), isIP: /* @__PURE__ */ __name(() => Fu, "isIP") });
    __name2(Fu, "Fu");
    wt = z(() => {
      "use strict";
      p();
      ds = Te(we(), 1);
      a(Fu, "isIP");
      Mu = a((r) => r.replace(
        /^[^.]+\./,
        "api."
      ), "transformHost"), E = /* @__PURE__ */ __name2(class E2 extends ds.EventEmitter {
        static {
          __name(this, "E2");
        }
        constructor() {
          super(...arguments);
          _(this, "opts", {});
          _(this, "connecting", false);
          _(this, "pending", true);
          _(
            this,
            "writable",
            true
          );
          _(this, "encrypted", false);
          _(this, "authorized", false);
          _(this, "destroyed", false);
          _(
            this,
            "ws",
            null
          );
          _(this, "writeBuffer");
          _(this, "tlsState", 0);
          _(this, "tlsRead");
          _(this, "tlsWrite");
        }
        static get poolQueryViaFetch() {
          return E2.opts.poolQueryViaFetch ?? E2.defaults.poolQueryViaFetch;
        }
        static set poolQueryViaFetch(t) {
          E2.opts.poolQueryViaFetch = t;
        }
        static get fetchEndpoint() {
          return E2.opts.fetchEndpoint ?? E2.defaults.fetchEndpoint;
        }
        static set fetchEndpoint(t) {
          E2.opts.fetchEndpoint = t;
        }
        static get fetchConnectionCache() {
          return true;
        }
        static set fetchConnectionCache(t) {
          console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
        }
        static get fetchFunction() {
          return E2.opts.fetchFunction ?? E2.defaults.fetchFunction;
        }
        static set fetchFunction(t) {
          E2.opts.fetchFunction = t;
        }
        static get webSocketConstructor() {
          return E2.opts.webSocketConstructor ?? E2.defaults.webSocketConstructor;
        }
        static set webSocketConstructor(t) {
          E2.opts.webSocketConstructor = t;
        }
        get webSocketConstructor() {
          return this.opts.webSocketConstructor ?? E2.webSocketConstructor;
        }
        set webSocketConstructor(t) {
          this.opts.webSocketConstructor = t;
        }
        static get wsProxy() {
          return E2.opts.wsProxy ?? E2.defaults.wsProxy;
        }
        static set wsProxy(t) {
          E2.opts.wsProxy = t;
        }
        get wsProxy() {
          return this.opts.wsProxy ?? E2.wsProxy;
        }
        set wsProxy(t) {
          this.opts.wsProxy = t;
        }
        static get coalesceWrites() {
          return E2.opts.coalesceWrites ?? E2.defaults.coalesceWrites;
        }
        static set coalesceWrites(t) {
          E2.opts.coalesceWrites = t;
        }
        get coalesceWrites() {
          return this.opts.coalesceWrites ?? E2.coalesceWrites;
        }
        set coalesceWrites(t) {
          this.opts.coalesceWrites = t;
        }
        static get useSecureWebSocket() {
          return E2.opts.useSecureWebSocket ?? E2.defaults.useSecureWebSocket;
        }
        static set useSecureWebSocket(t) {
          E2.opts.useSecureWebSocket = t;
        }
        get useSecureWebSocket() {
          return this.opts.useSecureWebSocket ?? E2.useSecureWebSocket;
        }
        set useSecureWebSocket(t) {
          this.opts.useSecureWebSocket = t;
        }
        static get forceDisablePgSSL() {
          return E2.opts.forceDisablePgSSL ?? E2.defaults.forceDisablePgSSL;
        }
        static set forceDisablePgSSL(t) {
          E2.opts.forceDisablePgSSL = t;
        }
        get forceDisablePgSSL() {
          return this.opts.forceDisablePgSSL ?? E2.forceDisablePgSSL;
        }
        set forceDisablePgSSL(t) {
          this.opts.forceDisablePgSSL = t;
        }
        static get disableSNI() {
          return E2.opts.disableSNI ?? E2.defaults.disableSNI;
        }
        static set disableSNI(t) {
          E2.opts.disableSNI = t;
        }
        get disableSNI() {
          return this.opts.disableSNI ?? E2.disableSNI;
        }
        set disableSNI(t) {
          this.opts.disableSNI = t;
        }
        static get pipelineConnect() {
          return E2.opts.pipelineConnect ?? E2.defaults.pipelineConnect;
        }
        static set pipelineConnect(t) {
          E2.opts.pipelineConnect = t;
        }
        get pipelineConnect() {
          return this.opts.pipelineConnect ?? E2.pipelineConnect;
        }
        set pipelineConnect(t) {
          this.opts.pipelineConnect = t;
        }
        static get subtls() {
          return E2.opts.subtls ?? E2.defaults.subtls;
        }
        static set subtls(t) {
          E2.opts.subtls = t;
        }
        get subtls() {
          return this.opts.subtls ?? E2.subtls;
        }
        set subtls(t) {
          this.opts.subtls = t;
        }
        static get pipelineTLS() {
          return E2.opts.pipelineTLS ?? E2.defaults.pipelineTLS;
        }
        static set pipelineTLS(t) {
          E2.opts.pipelineTLS = t;
        }
        get pipelineTLS() {
          return this.opts.pipelineTLS ?? E2.pipelineTLS;
        }
        set pipelineTLS(t) {
          this.opts.pipelineTLS = t;
        }
        static get rootCerts() {
          return E2.opts.rootCerts ?? E2.defaults.rootCerts;
        }
        static set rootCerts(t) {
          E2.opts.rootCerts = t;
        }
        get rootCerts() {
          return this.opts.rootCerts ?? E2.rootCerts;
        }
        set rootCerts(t) {
          this.opts.rootCerts = t;
        }
        wsProxyAddrForHost(t, n) {
          let i = this.wsProxy;
          if (i === void 0)
            throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
          return typeof i == "function" ? i(t, n) : `${i}?address=${t}:${n}`;
        }
        setNoDelay() {
          return this;
        }
        setKeepAlive() {
          return this;
        }
        ref() {
          return this;
        }
        unref() {
          return this;
        }
        connect(t, n, i) {
          this.connecting = true, i && this.once("connect", i);
          let s = a(() => {
            this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
          }, "handleWebSocketOpen"), o = a((c, h = false) => {
            c.binaryType = "arraybuffer", c.addEventListener("error", (l) => {
              this.emit("error", l), this.emit("close");
            }), c.addEventListener("message", (l) => {
              if (this.tlsState === 0) {
                let d = y.from(l.data);
                this.emit(
                  "data",
                  d
                );
              }
            }), c.addEventListener("close", () => {
              this.emit("close");
            }), h ? s() : c.addEventListener(
              "open",
              s
            );
          }, "configureWebSocket"), u;
          try {
            u = this.wsProxyAddrForHost(n, typeof t == "string" ? parseInt(t, 10) : t);
          } catch (c) {
            this.emit("error", c), this.emit("close");
            return;
          }
          try {
            let h = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
            if (this.webSocketConstructor !== void 0)
              this.ws = new this.webSocketConstructor(h), o(this.ws);
            else
              try {
                this.ws = new WebSocket(
                  h
                ), o(this.ws);
              } catch {
                this.ws = new __unstable_WebSocket(h), o(this.ws);
              }
          } catch (c) {
            let l = (this.useSecureWebSocket ? "https:" : "http:") + "//" + u;
            fetch(l, { headers: { Upgrade: "websocket" } }).then((d) => {
              if (this.ws = d.webSocket, this.ws == null)
                throw c;
              this.ws.accept(), o(
                this.ws,
                true
              );
            }).catch((d) => {
              this.emit("error", new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${d.message}`)), this.emit("close");
            });
          }
        }
        async startTls(t) {
          if (this.subtls === void 0)
            throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");
          this.tlsState = 1;
          let n = this.subtls.TrustedCert.fromPEM(this.rootCerts), i = new this.subtls.WebSocketReadQueue(this.ws), s = i.read.bind(
            i
          ), o = this.rawWrite.bind(this), [u, c] = await this.subtls.startTls(t, n, s, o, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
          this.tlsRead = u, this.tlsWrite = c, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit(
            "secureConnection",
            this
          ), this.tlsReadLoop();
        }
        async tlsReadLoop() {
          for (; ; ) {
            let t = await this.tlsRead();
            if (t === void 0)
              break;
            {
              let n = y.from(t);
              this.emit("data", n);
            }
          }
        }
        rawWrite(t) {
          if (!this.coalesceWrites) {
            this.ws.send(t);
            return;
          }
          if (this.writeBuffer === void 0)
            this.writeBuffer = t, setTimeout(
              () => {
                this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
              },
              0
            );
          else {
            let n = new Uint8Array(this.writeBuffer.length + t.length);
            n.set(this.writeBuffer), n.set(t, this.writeBuffer.length), this.writeBuffer = n;
          }
        }
        write(t, n = "utf8", i = (s) => {
        }) {
          return t.length === 0 ? (i(), true) : (typeof t == "string" && (t = y.from(t, n)), this.tlsState === 0 ? (this.rawWrite(t), i()) : this.tlsState === 1 ? this.once("secureConnection", () => {
            this.write(
              t,
              n,
              i
            );
          }) : (this.tlsWrite(t), i()), true);
        }
        end(t = y.alloc(0), n = "utf8", i = () => {
        }) {
          return this.write(t, n, () => {
            this.ws.close(), i();
          }), this;
        }
        destroy() {
          return this.destroyed = true, this.end();
        }
      }, "E");
      a(E, "Socket"), _(E, "defaults", {
        poolQueryViaFetch: false,
        fetchEndpoint: a((t) => "https://" + Mu(t) + "/sql", "fetchEndpoint"),
        fetchConnectionCache: true,
        fetchFunction: void 0,
        webSocketConstructor: void 0,
        wsProxy: a((t) => t + "/v2", "wsProxy"),
        useSecureWebSocket: true,
        forceDisablePgSSL: true,
        coalesceWrites: true,
        pipelineConnect: "password",
        subtls: void 0,
        rootCerts: "",
        pipelineTLS: false,
        disableSNI: false
      }), _(E, "opts", {});
      _e = E;
    });
    Yr = I((T) => {
      "use strict";
      p();
      Object.defineProperty(T, "__esModule", { value: true });
      T.NoticeMessage = T.DataRowMessage = T.CommandCompleteMessage = T.ReadyForQueryMessage = T.NotificationResponseMessage = T.BackendKeyDataMessage = T.AuthenticationMD5Password = T.ParameterStatusMessage = T.ParameterDescriptionMessage = T.RowDescriptionMessage = T.Field = T.CopyResponse = T.CopyDataMessage = T.DatabaseError = T.copyDone = T.emptyQuery = T.replicationStart = T.portalSuspended = T.noData = T.closeComplete = T.bindComplete = T.parseComplete = void 0;
      T.parseComplete = { name: "parseComplete", length: 5 };
      T.bindComplete = { name: "bindComplete", length: 5 };
      T.closeComplete = { name: "closeComplete", length: 5 };
      T.noData = { name: "noData", length: 5 };
      T.portalSuspended = { name: "portalSuspended", length: 5 };
      T.replicationStart = { name: "replicationStart", length: 4 };
      T.emptyQuery = { name: "emptyQuery", length: 4 };
      T.copyDone = { name: "copyDone", length: 4 };
      var kr = /* @__PURE__ */ __name2(class kr extends Error {
        static {
          __name(this, "kr");
        }
        constructor(e, t, n) {
          super(
            e
          ), this.length = t, this.name = n;
        }
      }, "kr");
      a(kr, "DatabaseError");
      var vr = kr;
      T.DatabaseError = vr;
      var Ur = /* @__PURE__ */ __name2(class Ur {
        static {
          __name(this, "Ur");
        }
        constructor(e, t) {
          this.length = e, this.chunk = t, this.name = "copyData";
        }
      }, "Ur");
      a(Ur, "CopyDataMessage");
      var Er = Ur;
      T.CopyDataMessage = Er;
      var Or = /* @__PURE__ */ __name2(class Or {
        static {
          __name(this, "Or");
        }
        constructor(e, t, n, i) {
          this.length = e, this.name = t, this.binary = n, this.columnTypes = new Array(i);
        }
      }, "Or");
      a(Or, "CopyResponse");
      var _r = Or;
      T.CopyResponse = _r;
      var Nr = /* @__PURE__ */ __name2(class Nr {
        static {
          __name(this, "Nr");
        }
        constructor(e, t, n, i, s, o, u) {
          this.name = e, this.tableID = t, this.columnID = n, this.dataTypeID = i, this.dataTypeSize = s, this.dataTypeModifier = o, this.format = u;
        }
      }, "Nr");
      a(Nr, "Field");
      var Ar = Nr;
      T.Field = Ar;
      var qr = /* @__PURE__ */ __name2(class qr {
        static {
          __name(this, "qr");
        }
        constructor(e, t) {
          this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(
            this.fieldCount
          );
        }
      }, "qr");
      a(qr, "RowDescriptionMessage");
      var Cr = qr;
      T.RowDescriptionMessage = Cr;
      var Qr = /* @__PURE__ */ __name2(class Qr {
        static {
          __name(this, "Qr");
        }
        constructor(e, t) {
          this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
        }
      }, "Qr");
      a(Qr, "ParameterDescriptionMessage");
      var Tr = Qr;
      T.ParameterDescriptionMessage = Tr;
      var Wr = /* @__PURE__ */ __name2(class Wr {
        static {
          __name(this, "Wr");
        }
        constructor(e, t, n) {
          this.length = e, this.parameterName = t, this.parameterValue = n, this.name = "parameterStatus";
        }
      }, "Wr");
      a(Wr, "ParameterStatusMessage");
      var Ir = Wr;
      T.ParameterStatusMessage = Ir;
      var jr = /* @__PURE__ */ __name2(class jr {
        static {
          __name(this, "jr");
        }
        constructor(e, t) {
          this.length = e, this.salt = t, this.name = "authenticationMD5Password";
        }
      }, "jr");
      a(jr, "AuthenticationMD5Password");
      var Pr = jr;
      T.AuthenticationMD5Password = Pr;
      var Hr = /* @__PURE__ */ __name2(class Hr {
        static {
          __name(this, "Hr");
        }
        constructor(e, t, n) {
          this.length = e, this.processID = t, this.secretKey = n, this.name = "backendKeyData";
        }
      }, "Hr");
      a(
        Hr,
        "BackendKeyDataMessage"
      );
      var Br = Hr;
      T.BackendKeyDataMessage = Br;
      var Gr = /* @__PURE__ */ __name2(class Gr {
        static {
          __name(this, "Gr");
        }
        constructor(e, t, n, i) {
          this.length = e, this.processId = t, this.channel = n, this.payload = i, this.name = "notification";
        }
      }, "Gr");
      a(Gr, "NotificationResponseMessage");
      var Lr = Gr;
      T.NotificationResponseMessage = Lr;
      var $r = /* @__PURE__ */ __name2(class $r {
        static {
          __name(this, "$r");
        }
        constructor(e, t) {
          this.length = e, this.status = t, this.name = "readyForQuery";
        }
      }, "$r");
      a($r, "ReadyForQueryMessage");
      var Rr = $r;
      T.ReadyForQueryMessage = Rr;
      var Vr = /* @__PURE__ */ __name2(class Vr {
        static {
          __name(this, "Vr");
        }
        constructor(e, t) {
          this.length = e, this.text = t, this.name = "commandComplete";
        }
      }, "Vr");
      a(Vr, "CommandCompleteMessage");
      var Fr = Vr;
      T.CommandCompleteMessage = Fr;
      var Kr = /* @__PURE__ */ __name2(class Kr {
        static {
          __name(this, "Kr");
        }
        constructor(e, t) {
          this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
        }
      }, "Kr");
      a(Kr, "DataRowMessage");
      var Mr = Kr;
      T.DataRowMessage = Mr;
      var zr = /* @__PURE__ */ __name2(class zr {
        static {
          __name(this, "zr");
        }
        constructor(e, t) {
          this.length = e, this.message = t, this.name = "notice";
        }
      }, "zr");
      a(zr, "NoticeMessage");
      var Dr = zr;
      T.NoticeMessage = Dr;
    });
    ms = I((bt) => {
      "use strict";
      p();
      Object.defineProperty(bt, "__esModule", { value: true });
      bt.Writer = void 0;
      var Jr = /* @__PURE__ */ __name2(class Jr {
        static {
          __name(this, "Jr");
        }
        constructor(e = 256) {
          this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = y.allocUnsafe(e);
        }
        ensure(e) {
          var t = this.buffer.length - this.offset;
          if (t < e) {
            var n = this.buffer, i = n.length + (n.length >> 1) + e;
            this.buffer = y.allocUnsafe(
              i
            ), n.copy(this.buffer);
          }
        }
        addInt32(e) {
          return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
        }
        addInt16(e) {
          return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
        }
        addCString(e) {
          if (!e)
            this.ensure(1);
          else {
            var t = y.byteLength(e);
            this.ensure(t + 1), this.buffer.write(
              e,
              this.offset,
              "utf-8"
            ), this.offset += t;
          }
          return this.buffer[this.offset++] = 0, this;
        }
        addString(e = "") {
          var t = y.byteLength(e);
          return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
        }
        add(e) {
          return this.ensure(e.length), e.copy(this.buffer, this.offset), this.offset += e.length, this;
        }
        join(e) {
          if (e) {
            this.buffer[this.headerPosition] = e;
            let t = this.offset - (this.headerPosition + 1);
            this.buffer.writeInt32BE(t, this.headerPosition + 1);
          }
          return this.buffer.slice(e ? 0 : 5, this.offset);
        }
        flush(e) {
          var t = this.join(e);
          return this.offset = 5, this.headerPosition = 0, this.buffer = y.allocUnsafe(this.size), t;
        }
      }, "Jr");
      a(Jr, "Writer");
      var Zr = Jr;
      bt.Writer = Zr;
    });
    ws = I((xt) => {
      "use strict";
      p();
      Object.defineProperty(xt, "__esModule", { value: true });
      xt.serialize = void 0;
      var Xr = ms(), M = new Xr.Writer(), Du = a((r) => {
        M.addInt16(3).addInt16(
          0
        );
        for (let n of Object.keys(r))
          M.addCString(n).addCString(r[n]);
        M.addCString("client_encoding").addCString("UTF8");
        var e = M.addCString("").flush(), t = e.length + 4;
        return new Xr.Writer().addInt32(t).add(e).flush();
      }, "startup"), ku = a(() => {
        let r = y.allocUnsafe(8);
        return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
      }, "requestSsl"), Uu = a((r) => M.addCString(r).flush(112), "password"), Ou = a(function(r, e) {
        return M.addCString(r).addInt32(
          y.byteLength(e)
        ).addString(e), M.flush(112);
      }, "sendSASLInitialResponseMessage"), Nu = a(
        function(r) {
          return M.addString(r).flush(112);
        },
        "sendSCRAMClientFinalMessage"
      ), qu = a(
        (r) => M.addCString(r).flush(81),
        "query"
      ), gs = [], Qu = a((r) => {
        let e = r.name || "";
        e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
        let t = r.types || gs;
        for (var n = t.length, i = M.addCString(e).addCString(r.text).addInt16(n), s = 0; s < n; s++)
          i.addInt32(t[s]);
        return M.flush(80);
      }, "parse"), Oe = new Xr.Writer(), Wu = a(function(r, e) {
        for (let t = 0; t < r.length; t++) {
          let n = e ? e(r[t], t) : r[t];
          n == null ? (M.addInt16(0), Oe.addInt32(-1)) : n instanceof y ? (M.addInt16(1), Oe.addInt32(n.length), Oe.add(n)) : (M.addInt16(0), Oe.addInt32(y.byteLength(
            n
          )), Oe.addString(n));
        }
      }, "writeValues"), ju = a((r = {}) => {
        let e = r.portal || "", t = r.statement || "", n = r.binary || false, i = r.values || gs, s = i.length;
        return M.addCString(e).addCString(t), M.addInt16(s), Wu(i, r.valueMapper), M.addInt16(s), M.add(Oe.flush()), M.addInt16(n ? 1 : 0), M.flush(66);
      }, "bind"), Hu = y.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Gu = a((r) => {
        if (!r || !r.portal && !r.rows)
          return Hu;
        let e = r.portal || "", t = r.rows || 0, n = y.byteLength(e), i = 4 + n + 1 + 4, s = y.allocUnsafe(1 + i);
        return s[0] = 69, s.writeInt32BE(i, 1), s.write(e, 5, "utf-8"), s[n + 5] = 0, s.writeUInt32BE(t, s.length - 4), s;
      }, "execute"), $u = a((r, e) => {
        let t = y.allocUnsafe(16);
        return t.writeInt32BE(16, 0), t.writeInt16BE(1234, 4), t.writeInt16BE(5678, 6), t.writeInt32BE(
          r,
          8
        ), t.writeInt32BE(e, 12), t;
      }, "cancel"), en = a(
        (r, e) => {
          let n = 4 + y.byteLength(e) + 1, i = y.allocUnsafe(1 + n);
          return i[0] = r, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[n] = 0, i;
        },
        "cstringMessage"
      ), Vu = M.addCString("P").flush(68), Ku = M.addCString("S").flush(68), zu = a((r) => r.name ? en(68, `${r.type}${r.name || ""}`) : r.type === "P" ? Vu : Ku, "describe"), Yu = a(
        (r) => {
          let e = `${r.type}${r.name || ""}`;
          return en(67, e);
        },
        "close"
      ), Zu = a((r) => M.add(r).flush(
        100
      ), "copyData"), Ju = a((r) => en(102, r), "copyFail"), St = a((r) => y.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"), Xu = St(72), ec = St(83), tc = St(88), rc = St(99), nc = {
        startup: Du,
        password: Uu,
        requestSsl: ku,
        sendSASLInitialResponseMessage: Ou,
        sendSCRAMClientFinalMessage: Nu,
        query: qu,
        parse: Qu,
        bind: ju,
        execute: Gu,
        describe: zu,
        close: Yu,
        flush: a(() => Xu, "flush"),
        sync: a(
          () => ec,
          "sync"
        ),
        end: a(() => tc, "end"),
        copyData: Zu,
        copyDone: a(() => rc, "copyDone"),
        copyFail: Ju,
        cancel: $u
      };
      xt.serialize = nc;
    });
    bs = I((vt) => {
      "use strict";
      p();
      Object.defineProperty(vt, "__esModule", { value: true });
      vt.BufferReader = void 0;
      var ic = y.allocUnsafe(0), rn = /* @__PURE__ */ __name2(class rn {
        static {
          __name(this, "rn");
        }
        constructor(e = 0) {
          this.offset = e, this.buffer = ic, this.encoding = "utf-8";
        }
        setBuffer(e, t) {
          this.offset = e, this.buffer = t;
        }
        int16() {
          let e = this.buffer.readInt16BE(this.offset);
          return this.offset += 2, e;
        }
        byte() {
          let e = this.buffer[this.offset];
          return this.offset++, e;
        }
        int32() {
          let e = this.buffer.readInt32BE(this.offset);
          return this.offset += 4, e;
        }
        string(e) {
          let t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
          return this.offset += e, t;
        }
        cstring() {
          let e = this.offset, t = e;
          for (; this.buffer[t++] !== 0; )
            ;
          return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
        }
        bytes(e) {
          let t = this.buffer.slice(this.offset, this.offset + e);
          return this.offset += e, t;
        }
      }, "rn");
      a(rn, "BufferReader");
      var tn = rn;
      vt.BufferReader = tn;
    });
    vs = I((Et) => {
      "use strict";
      p();
      Object.defineProperty(Et, "__esModule", { value: true });
      Et.Parser = void 0;
      var D = Yr(), sc = bs(), nn = 1, oc = 4, Ss = nn + oc, xs = y.allocUnsafe(0), on2 = /* @__PURE__ */ __name2(class on {
        static {
          __name(this, "on");
        }
        constructor(e) {
          if (this.buffer = xs, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new sc.BufferReader(), e?.mode === "binary")
            throw new Error("Binary mode not supported yet");
          this.mode = e?.mode || "text";
        }
        parse(e, t) {
          this.mergeBuffer(e);
          let n = this.bufferOffset + this.bufferLength, i = this.bufferOffset;
          for (; i + Ss <= n; ) {
            let s = this.buffer[i], o = this.buffer.readUInt32BE(
              i + nn
            ), u = nn + o;
            if (u + i <= n) {
              let c = this.handlePacket(i + Ss, s, o, this.buffer);
              t(c), i += u;
            } else
              break;
          }
          i === n ? (this.buffer = xs, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = n - i, this.bufferOffset = i);
        }
        mergeBuffer(e) {
          if (this.bufferLength > 0) {
            let t = this.bufferLength + e.byteLength;
            if (t + this.bufferOffset > this.buffer.byteLength) {
              let i;
              if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength)
                i = this.buffer;
              else {
                let s = this.buffer.byteLength * 2;
                for (; t >= s; )
                  s *= 2;
                i = y.allocUnsafe(s);
              }
              this.buffer.copy(
                i,
                0,
                this.bufferOffset,
                this.bufferOffset + this.bufferLength
              ), this.buffer = i, this.bufferOffset = 0;
            }
            e.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t;
          } else
            this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
        }
        handlePacket(e, t, n, i) {
          switch (t) {
            case 50:
              return D.bindComplete;
            case 49:
              return D.parseComplete;
            case 51:
              return D.closeComplete;
            case 110:
              return D.noData;
            case 115:
              return D.portalSuspended;
            case 99:
              return D.copyDone;
            case 87:
              return D.replicationStart;
            case 73:
              return D.emptyQuery;
            case 68:
              return this.parseDataRowMessage(
                e,
                n,
                i
              );
            case 67:
              return this.parseCommandCompleteMessage(e, n, i);
            case 90:
              return this.parseReadyForQueryMessage(e, n, i);
            case 65:
              return this.parseNotificationMessage(
                e,
                n,
                i
              );
            case 82:
              return this.parseAuthenticationResponse(e, n, i);
            case 83:
              return this.parseParameterStatusMessage(e, n, i);
            case 75:
              return this.parseBackendKeyData(e, n, i);
            case 69:
              return this.parseErrorMessage(e, n, i, "error");
            case 78:
              return this.parseErrorMessage(
                e,
                n,
                i,
                "notice"
              );
            case 84:
              return this.parseRowDescriptionMessage(e, n, i);
            case 116:
              return this.parseParameterDescriptionMessage(e, n, i);
            case 71:
              return this.parseCopyInMessage(
                e,
                n,
                i
              );
            case 72:
              return this.parseCopyOutMessage(e, n, i);
            case 100:
              return this.parseCopyData(
                e,
                n,
                i
              );
            default:
              return new D.DatabaseError("received invalid response: " + t.toString(
                16
              ), n, "error");
          }
        }
        parseReadyForQueryMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.string(1);
          return new D.ReadyForQueryMessage(t, i);
        }
        parseCommandCompleteMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.cstring();
          return new D.CommandCompleteMessage(
            t,
            i
          );
        }
        parseCopyData(e, t, n) {
          let i = n.slice(e, e + (t - 4));
          return new D.CopyDataMessage(
            t,
            i
          );
        }
        parseCopyInMessage(e, t, n) {
          return this.parseCopyMessage(e, t, n, "copyInResponse");
        }
        parseCopyOutMessage(e, t, n) {
          return this.parseCopyMessage(e, t, n, "copyOutResponse");
        }
        parseCopyMessage(e, t, n, i) {
          this.reader.setBuffer(e, n);
          let s = this.reader.byte() !== 0, o = this.reader.int16(), u = new D.CopyResponse(t, i, s, o);
          for (let c = 0; c < o; c++)
            u.columnTypes[c] = this.reader.int16();
          return u;
        }
        parseNotificationMessage(e, t, n) {
          this.reader.setBuffer(
            e,
            n
          );
          let i = this.reader.int32(), s = this.reader.cstring(), o = this.reader.cstring();
          return new D.NotificationResponseMessage(t, i, s, o);
        }
        parseRowDescriptionMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.int16(), s = new D.RowDescriptionMessage(t, i);
          for (let o = 0; o < i; o++)
            s.fields[o] = this.parseField();
          return s;
        }
        parseField() {
          let e = this.reader.cstring(), t = this.reader.int32(), n = this.reader.int16(), i = this.reader.int32(), s = this.reader.int16(), o = this.reader.int32(), u = this.reader.int16() === 0 ? "text" : "binary";
          return new D.Field(e, t, n, i, s, o, u);
        }
        parseParameterDescriptionMessage(e, t, n) {
          this.reader.setBuffer(
            e,
            n
          );
          let i = this.reader.int16(), s = new D.ParameterDescriptionMessage(t, i);
          for (let o = 0; o < i; o++)
            s.dataTypeIDs[o] = this.reader.int32();
          return s;
        }
        parseDataRowMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.int16(), s = new Array(i);
          for (let o = 0; o < i; o++) {
            let u = this.reader.int32();
            s[o] = u === -1 ? null : this.reader.string(u);
          }
          return new D.DataRowMessage(
            t,
            s
          );
        }
        parseParameterStatusMessage(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.cstring(), s = this.reader.cstring();
          return new D.ParameterStatusMessage(t, i, s);
        }
        parseBackendKeyData(e, t, n) {
          this.reader.setBuffer(e, n);
          let i = this.reader.int32(), s = this.reader.int32();
          return new D.BackendKeyDataMessage(t, i, s);
        }
        parseAuthenticationResponse(e, t, n) {
          this.reader.setBuffer(
            e,
            n
          );
          let i = this.reader.int32(), s = { name: "authenticationOk", length: t };
          switch (i) {
            case 0:
              break;
            case 3:
              s.length === 8 && (s.name = "authenticationCleartextPassword");
              break;
            case 5:
              if (s.length === 12) {
                s.name = "authenticationMD5Password";
                let u = this.reader.bytes(4);
                return new D.AuthenticationMD5Password(t, u);
              }
              break;
            case 10:
              s.name = "authenticationSASL", s.mechanisms = [];
              let o;
              do
                o = this.reader.cstring(), o && s.mechanisms.push(o);
              while (o);
              break;
            case 11:
              s.name = "authenticationSASLContinue", s.data = this.reader.string(t - 8);
              break;
            case 12:
              s.name = "authenticationSASLFinal", s.data = this.reader.string(t - 8);
              break;
            default:
              throw new Error("Unknown authenticationOk message type " + i);
          }
          return s;
        }
        parseErrorMessage(e, t, n, i) {
          this.reader.setBuffer(e, n);
          let s = {}, o = this.reader.string(1);
          for (; o !== "\0"; )
            s[o] = this.reader.cstring(), o = this.reader.string(1);
          let u = s.M, c = i === "notice" ? new D.NoticeMessage(
            t,
            u
          ) : new D.DatabaseError(u, t, i);
          return c.severity = s.S, c.code = s.C, c.detail = s.D, c.hint = s.H, c.position = s.P, c.internalPosition = s.p, c.internalQuery = s.q, c.where = s.W, c.schema = s.s, c.table = s.t, c.column = s.c, c.dataType = s.d, c.constraint = s.n, c.file = s.F, c.line = s.L, c.routine = s.R, c;
        }
      }, "on");
      a(on2, "Parser");
      var sn = on2;
      Et.Parser = sn;
    });
    an = I((Se) => {
      "use strict";
      p();
      Object.defineProperty(Se, "__esModule", { value: true });
      Se.DatabaseError = Se.serialize = Se.parse = void 0;
      var ac = Yr();
      Object.defineProperty(
        Se,
        "DatabaseError",
        { enumerable: true, get: a(function() {
          return ac.DatabaseError;
        }, "get") }
      );
      var uc = ws();
      Object.defineProperty(Se, "serialize", { enumerable: true, get: a(function() {
        return uc.serialize;
      }, "get") });
      var cc = vs();
      function hc(r, e) {
        let t = new cc.Parser();
        return r.on("data", (n) => t.parse(n, e)), new Promise((n) => r.on("end", () => n()));
      }
      __name(hc, "hc");
      __name2(hc, "hc");
      a(hc, "parse");
      Se.parse = hc;
    });
    Es = {};
    ie(Es, { connect: /* @__PURE__ */ __name(() => lc, "connect") });
    __name2(lc, "lc");
    _s = z(() => {
      "use strict";
      p();
      a(lc, "connect");
    });
    hn = I((tf, Ts) => {
      "use strict";
      p();
      var As = (wt(), N(ys)), fc = we().EventEmitter, {
        parse: pc,
        serialize: Q
      } = an(), Cs = Q.flush(), dc = Q.sync(), yc = Q.end(), cn = /* @__PURE__ */ __name2(class cn extends fc {
        static {
          __name(this, "cn");
        }
        constructor(e) {
          super(), e = e || {}, this.stream = e.stream || new As.Socket(), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e.ssl || false, this._ending = false, this._emitMessage = false;
          var t = this;
          this.on("newListener", function(n) {
            n === "message" && (t._emitMessage = true);
          });
        }
        connect(e, t) {
          var n = this;
          this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(
            e,
            t
          ), this.stream.once("connect", function() {
            n._keepAlive && n.stream.setKeepAlive(
              true,
              n._keepAliveInitialDelayMillis
            ), n.emit("connect");
          });
          let i = a(function(s) {
            n._ending && (s.code === "ECONNRESET" || s.code === "EPIPE") || n.emit("error", s);
          }, "reportStreamError");
          if (this.stream.on("error", i), this.stream.on("close", function() {
            n.emit("end");
          }), !this.ssl)
            return this.attachListeners(this.stream);
          this.stream.once("data", function(s) {
            var o = s.toString("utf8");
            switch (o) {
              case "S":
                break;
              case "N":
                return n.stream.end(), n.emit("error", new Error("The server does not support SSL connections"));
              default:
                return n.stream.end(), n.emit("error", new Error("There was an error establishing an SSL connection"));
            }
            var u = (_s(), N(Es));
            let c = { socket: n.stream };
            n.ssl !== true && (Object.assign(
              c,
              n.ssl
            ), "key" in n.ssl && (c.key = n.ssl.key)), As.isIP(t) === 0 && (c.servername = t);
            try {
              n.stream = u.connect(c);
            } catch (h) {
              return n.emit("error", h);
            }
            n.attachListeners(n.stream), n.stream.on("error", i), n.emit("sslconnect");
          });
        }
        attachListeners(e) {
          e.on("end", () => {
            this.emit("end");
          }), pc(e, (t) => {
            var n = t.name === "error" ? "errorMessage" : t.name;
            this._emitMessage && this.emit("message", t), this.emit(n, t);
          });
        }
        requestSsl() {
          this.stream.write(Q.requestSsl());
        }
        startup(e) {
          this.stream.write(Q.startup(e));
        }
        cancel(e, t) {
          this._send(Q.cancel(e, t));
        }
        password(e) {
          this._send(Q.password(e));
        }
        sendSASLInitialResponseMessage(e, t) {
          this._send(Q.sendSASLInitialResponseMessage(
            e,
            t
          ));
        }
        sendSCRAMClientFinalMessage(e) {
          this._send(Q.sendSCRAMClientFinalMessage(e));
        }
        _send(e) {
          return this.stream.writable ? this.stream.write(e) : false;
        }
        query(e) {
          this._send(Q.query(
            e
          ));
        }
        parse(e) {
          this._send(Q.parse(e));
        }
        bind(e) {
          this._send(Q.bind(e));
        }
        execute(e) {
          this._send(Q.execute(e));
        }
        flush() {
          this.stream.writable && this.stream.write(Cs);
        }
        sync() {
          this._ending = true, this._send(Cs), this._send(dc);
        }
        ref() {
          this.stream.ref();
        }
        unref() {
          this.stream.unref();
        }
        end() {
          if (this._ending = true, !this._connecting || !this.stream.writable) {
            this.stream.end();
            return;
          }
          return this.stream.write(yc, () => {
            this.stream.end();
          });
        }
        close(e) {
          this._send(Q.close(e));
        }
        describe(e) {
          this._send(Q.describe(e));
        }
        sendCopyFromChunk(e) {
          this._send(Q.copyData(e));
        }
        endCopyFrom() {
          this._send(Q.copyDone());
        }
        sendCopyFail(e) {
          this._send(Q.copyFail(e));
        }
      }, "cn");
      a(cn, "Connection");
      var un = cn;
      Ts.exports = un;
    });
    Bs = I((of, Ps) => {
      "use strict";
      p();
      var mc = we().EventEmitter, sf = (He(), N(je)), gc = et(), ln = qi(), wc = Zi(), bc = mt(), Sc = gt(), Is = ps(), xc = Xe(), vc = hn(), fn = /* @__PURE__ */ __name2(class fn extends mc {
        static {
          __name(this, "fn");
        }
        constructor(e) {
          super(), this.connectionParameters = new Sc(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }), this.replication = this.connectionParameters.replication;
          var t = e || {};
          this._Promise = t.Promise || S.Promise, this._types = new bc(t.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t.connection || new vc({ stream: t.stream, ssl: this.connectionParameters.ssl, keepAlive: t.keepAlive || false, keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t.binary || xc.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
        }
        _errorAllQueries(e) {
          let t = a(
            (n) => {
              m.nextTick(() => {
                n.handleError(e, this.connection);
              });
            },
            "enqueueError"
          );
          this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
        }
        _connect(e) {
          var t = this, n = this.connection;
          if (this._connectionCallback = e, this._connecting || this._connected) {
            let i = new Error("Client has already been connected. You cannot reuse a client.");
            m.nextTick(() => {
              e(i);
            });
            return;
          }
          this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
            n._ending = true, n.stream.destroy(new Error("timeout expired"));
          }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
            t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
          }), n.on("sslconnect", function() {
            n.startup(t.getStartupConf());
          }), this._attachListeners(n), n.once("end", () => {
            let i = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
            clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(i), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(i) : this._handleErrorEvent(i) : this._connectionError || this._handleErrorEvent(
              i
            )), m.nextTick(() => {
              this.emit("end");
            });
          });
        }
        connect(e) {
          if (e) {
            this._connect(e);
            return;
          }
          return new this._Promise((t, n) => {
            this._connect((i) => {
              i ? n(i) : t();
            });
          });
        }
        _attachListeners(e) {
          e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on(
            "errorMessage",
            this._handleErrorMessage.bind(this)
          ), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(this)), e.on(
            "emptyQuery",
            this._handleEmptyQuery.bind(this)
          ), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
        }
        _checkPgPass(e) {
          let t = this.connection;
          typeof this.password == "function" ? this._Promise.resolve().then(
            () => this.password()
          ).then((n) => {
            if (n !== void 0) {
              if (typeof n != "string") {
                t.emit("error", new TypeError("Password must be a string"));
                return;
              }
              this.connectionParameters.password = this.password = n;
            } else
              this.connectionParameters.password = this.password = null;
            e();
          }).catch((n) => {
            t.emit("error", n);
          }) : this.password !== null ? e() : wc(
            this.connectionParameters,
            (n) => {
              n !== void 0 && (this.connectionParameters.password = this.password = n), e();
            }
          );
        }
        _handleAuthCleartextPassword(e) {
          this._checkPgPass(() => {
            this.connection.password(this.password);
          });
        }
        _handleAuthMD5Password(e) {
          this._checkPgPass(() => {
            let t = gc.postgresMd5PasswordHash(
              this.user,
              this.password,
              e.salt
            );
            this.connection.password(t);
          });
        }
        _handleAuthSASL(e) {
          this._checkPgPass(() => {
            this.saslSession = ln.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(
              this.saslSession.mechanism,
              this.saslSession.response
            );
          });
        }
        _handleAuthSASLContinue(e) {
          ln.continueSession(this.saslSession, this.password, e.data), this.connection.sendSCRAMClientFinalMessage(
            this.saslSession.response
          );
        }
        _handleAuthSASLFinal(e) {
          ln.finalizeSession(
            this.saslSession,
            e.data
          ), this.saslSession = null;
        }
        _handleBackendKeyData(e) {
          this.processID = e.processID, this.secretKey = e.secretKey;
        }
        _handleReadyForQuery(e) {
          this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
          let { activeQuery: t } = this;
          this.activeQuery = null, this.readyForQuery = true, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
        }
        _handleErrorWhileConnecting(e) {
          if (!this._connectionError) {
            if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback)
              return this._connectionCallback(e);
            this.emit("error", e);
          }
        }
        _handleErrorEvent(e) {
          if (this._connecting)
            return this._handleErrorWhileConnecting(e);
          this._queryable = false, this._errorAllQueries(e), this.emit("error", e);
        }
        _handleErrorMessage(e) {
          if (this._connecting)
            return this._handleErrorWhileConnecting(e);
          let t = this.activeQuery;
          if (!t) {
            this._handleErrorEvent(
              e
            );
            return;
          }
          this.activeQuery = null, t.handleError(e, this.connection);
        }
        _handleRowDescription(e) {
          this.activeQuery.handleRowDescription(e);
        }
        _handleDataRow(e) {
          this.activeQuery.handleDataRow(
            e
          );
        }
        _handlePortalSuspended(e) {
          this.activeQuery.handlePortalSuspended(this.connection);
        }
        _handleEmptyQuery(e) {
          this.activeQuery.handleEmptyQuery(this.connection);
        }
        _handleCommandComplete(e) {
          this.activeQuery.handleCommandComplete(e, this.connection);
        }
        _handleParseComplete(e) {
          this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
        }
        _handleCopyInResponse(e) {
          this.activeQuery.handleCopyInResponse(
            this.connection
          );
        }
        _handleCopyData(e) {
          this.activeQuery.handleCopyData(e, this.connection);
        }
        _handleNotification(e) {
          this.emit("notification", e);
        }
        _handleNotice(e) {
          this.emit("notice", e);
        }
        getStartupConf() {
          var e = this.connectionParameters, t = { user: e.user, database: e.database }, n = e.application_name || e.fallback_application_name;
          return n && (t.application_name = n), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(
            e.statement_timeout,
            10
          ))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(
            e.idle_in_transaction_session_timeout,
            10
          ))), e.options && (t.options = e.options), t;
        }
        cancel(e, t) {
          if (e.activeQuery === t) {
            var n = this.connection;
            this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
              n.cancel(
                e.processID,
                e.secretKey
              );
            });
          } else
            e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
        }
        setTypeParser(e, t, n) {
          return this._types.setTypeParser(e, t, n);
        }
        getTypeParser(e, t) {
          return this._types.getTypeParser(e, t);
        }
        escapeIdentifier(e) {
          return '"' + e.replace(
            /"/g,
            '""'
          ) + '"';
        }
        escapeLiteral(e) {
          for (var t = false, n = "'", i = 0; i < e.length; i++) {
            var s = e[i];
            s === "'" ? n += s + s : s === "\\" ? (n += s + s, t = true) : n += s;
          }
          return n += "'", t === true && (n = " E" + n), n;
        }
        _pulseQueryQueue() {
          if (this.readyForQuery === true)
            if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
              this.readyForQuery = false, this.hasExecuted = true;
              let e = this.activeQuery.submit(this.connection);
              e && m.nextTick(() => {
                this.activeQuery.handleError(e, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
              });
            } else
              this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
        }
        query(e, t, n) {
          var i, s, o, u, c;
          if (e == null)
            throw new TypeError("Client was passed a null or undefined query");
          return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, s = i = e, typeof t == "function" && (i.callback = i.callback || t)) : (o = this.connectionParameters.query_timeout, i = new Is(
            e,
            t,
            n
          ), i.callback || (s = new this._Promise((h, l) => {
            i.callback = (d, b) => d ? l(d) : h(b);
          }))), o && (c = i.callback, u = setTimeout(() => {
            var h = new Error("Query read timeout");
            m.nextTick(
              () => {
                i.handleError(h, this.connection);
              }
            ), c(h), i.callback = () => {
            };
            var l = this.queryQueue.indexOf(i);
            l > -1 && this.queryQueue.splice(l, 1), this._pulseQueryQueue();
          }, o), i.callback = (h, l) => {
            clearTimeout(u), c(h, l);
          }), this.binary && !i.binary && (i.binary = true), i._result && !i._result._types && (i._result._types = this._types), this._queryable ? this._ending ? (m.nextTick(() => {
            i.handleError(
              new Error("Client was closed and is not queryable"),
              this.connection
            );
          }), s) : (this.queryQueue.push(i), this._pulseQueryQueue(), s) : (m.nextTick(
            () => {
              i.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
            }
          ), s);
        }
        ref() {
          this.connection.ref();
        }
        unref() {
          this.connection.unref();
        }
        end(e) {
          if (this._ending = true, !this.connection._connecting)
            if (e)
              e();
            else
              return this._Promise.resolve();
          if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e)
            this.connection.once("end", e);
          else
            return new this._Promise((t) => {
              this.connection.once("end", t);
            });
        }
      }, "fn");
      a(fn, "Client");
      var _t = fn;
      _t.Query = Is;
      Ps.exports = _t;
    });
    Ms = I((cf, Fs) => {
      "use strict";
      p();
      var Ec = we().EventEmitter, Ls = a(function() {
      }, "NOOP"), Rs = a(
        (r, e) => {
          let t = r.findIndex(e);
          return t === -1 ? void 0 : r.splice(t, 1)[0];
        },
        "removeWhere"
      ), yn = /* @__PURE__ */ __name2(class yn {
        static {
          __name(this, "yn");
        }
        constructor(e, t, n) {
          this.client = e, this.idleListener = t, this.timeoutId = n;
        }
      }, "yn");
      a(yn, "IdleItem");
      var pn = yn, mn = /* @__PURE__ */ __name2(class mn {
        static {
          __name(this, "mn");
        }
        constructor(e) {
          this.callback = e;
        }
      }, "mn");
      a(mn, "PendingItem");
      var Ne = mn;
      function _c() {
        throw new Error("Release called on client which has already been released to the pool.");
      }
      __name(_c, "_c");
      __name2(_c, "_c");
      a(_c, "throwOnDoubleRelease");
      function At(r, e) {
        if (e)
          return { callback: e, result: void 0 };
        let t, n, i = a(function(o, u) {
          o ? t(o) : n(u);
        }, "cb"), s = new r(function(o, u) {
          n = o, t = u;
        }).catch((o) => {
          throw Error.captureStackTrace(
            o
          ), o;
        });
        return { callback: i, result: s };
      }
      __name(At, "At");
      __name2(At, "At");
      a(At, "promisify");
      function Ac(r, e) {
        return a(
          /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function t(n) {
            n.client = e, e.removeListener("error", t), e.on("error", () => {
              r.log("additional client error after disconnection due to error", n);
            }), r._remove(e), r.emit("error", n, e);
          }, "t"), "t"),
          "idleListener"
        );
      }
      __name(Ac, "Ac");
      __name2(Ac, "Ac");
      a(Ac, "makeIdleListener");
      var gn = /* @__PURE__ */ __name2(class gn extends Ec {
        static {
          __name(this, "gn");
        }
        constructor(e, t) {
          super(), this.options = Object.assign({}, e), e != null && "password" in e && Object.defineProperty(
            this.options,
            "password",
            { configurable: true, enumerable: false, writable: true, value: e.password }
          ), e != null && e.ssl && e.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
          }, this.Client = this.options.Client || t || Ct().Client, this.Promise = this.options.Promise || S.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
        }
        _isFull() {
          return this._clients.length >= this.options.max;
        }
        _pulseQueue() {
          if (this.log("pulse queue"), this.ended) {
            this.log("pulse queue ended");
            return;
          }
          if (this.ending) {
            this.log(
              "pulse queue on ending"
            ), this._idle.length && this._idle.slice().map((t) => {
              this._remove(
                t.client
              );
            }), this._clients.length || (this.ended = true, this._endCallback());
            return;
          }
          if (!this._pendingQueue.length) {
            this.log("no queued requests");
            return;
          }
          if (!this._idle.length && this._isFull())
            return;
          let e = this._pendingQueue.shift();
          if (this._idle.length) {
            let t = this._idle.pop();
            clearTimeout(t.timeoutId);
            let n = t.client;
            n.ref && n.ref();
            let i = t.idleListener;
            return this._acquireClient(n, e, i, false);
          }
          if (!this._isFull())
            return this.newClient(e);
          throw new Error("unexpected condition");
        }
        _remove(e) {
          let t = Rs(this._idle, (n) => n.client === e);
          t !== void 0 && clearTimeout(t.timeoutId), this._clients = this._clients.filter((n) => n !== e), e.end(), this.emit("remove", e);
        }
        connect(e) {
          if (this.ending) {
            let i = new Error("Cannot use a pool after calling end on the pool");
            return e ? e(i) : this.Promise.reject(
              i
            );
          }
          let t = At(this.Promise, e), n = t.result;
          if (this._isFull() || this._idle.length) {
            if (this._idle.length && m.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis)
              return this._pendingQueue.push(new Ne(t.callback)), n;
            let i = a((u, c, h) => {
              clearTimeout(
                o
              ), t.callback(u, c, h);
            }, "queueCallback"), s = new Ne(i), o = setTimeout(() => {
              Rs(
                this._pendingQueue,
                (u) => u.callback === i
              ), s.timedOut = true, t.callback(new Error("timeout exceeded when trying to connect"));
            }, this.options.connectionTimeoutMillis);
            return this._pendingQueue.push(s), n;
          }
          return this.newClient(new Ne(t.callback)), n;
        }
        newClient(e) {
          let t = new this.Client(this.options);
          this._clients.push(t);
          let n = Ac(this, t);
          this.log("checking client timeout");
          let i, s = false;
          this.options.connectionTimeoutMillis && (i = setTimeout(() => {
            this.log("ending client due to timeout"), s = true, t.connection ? t.connection.stream.destroy() : t.end();
          }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t.connect((o) => {
            if (i && clearTimeout(i), t.on("error", n), o)
              this.log("client failed to connect", o), this._clients = this._clients.filter((u) => u !== t), s && (o.message = "Connection terminated due to connection timeout"), this._pulseQueue(), e.timedOut || e.callback(
                o,
                void 0,
                Ls
              );
            else {
              if (this.log("new client connected"), this.options.maxLifetimeSeconds !== 0) {
                let u = setTimeout(() => {
                  this.log("ending client due to expired lifetime"), this._expired.add(t), this._idle.findIndex((h) => h.client === t) !== -1 && this._acquireClient(
                    t,
                    new Ne((h, l, d) => d()),
                    n,
                    false
                  );
                }, this.options.maxLifetimeSeconds * 1e3);
                u.unref(), t.once(
                  "end",
                  () => clearTimeout(u)
                );
              }
              return this._acquireClient(t, e, n, true);
            }
          });
        }
        _acquireClient(e, t, n, i) {
          i && this.emit("connect", e), this.emit("acquire", e), e.release = this._releaseOnce(e, n), e.removeListener("error", n), t.timedOut ? i && this.options.verify ? this.options.verify(
            e,
            e.release
          ) : e.release() : i && this.options.verify ? this.options.verify(e, (s) => {
            if (s)
              return e.release(s), t.callback(s, void 0, Ls);
            t.callback(void 0, e, e.release);
          }) : t.callback(
            void 0,
            e,
            e.release
          );
        }
        _releaseOnce(e, t) {
          let n = false;
          return (i) => {
            n && _c(), n = true, this._release(
              e,
              t,
              i
            );
          };
        }
        _release(e, t, n) {
          if (e.on("error", t), e._poolUseCount = (e._poolUseCount || 0) + 1, this.emit("release", n, e), n || this.ending || !e._queryable || e._ending || e._poolUseCount >= this.options.maxUses) {
            e._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e), this._pulseQueue();
            return;
          }
          if (this._expired.has(e)) {
            this.log("remove expired client"), this._expired.delete(e), this._remove(e), this._pulseQueue();
            return;
          }
          let s;
          this.options.idleTimeoutMillis && (s = setTimeout(() => {
            this.log("remove idle client"), this._remove(e);
          }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && s.unref()), this.options.allowExitOnIdle && e.unref(), this._idle.push(new pn(e, t, s)), this._pulseQueue();
        }
        query(e, t, n) {
          if (typeof e == "function") {
            let s = At(this.Promise, e);
            return x(function() {
              return s.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
            }), s.result;
          }
          typeof t == "function" && (n = t, t = void 0);
          let i = At(this.Promise, n);
          return n = i.callback, this.connect((s, o) => {
            if (s)
              return n(s);
            let u = false, c = a((h) => {
              u || (u = true, o.release(h), n(h));
            }, "onError");
            o.once("error", c), this.log("dispatching query");
            try {
              o.query(e, t, (h, l) => {
                if (this.log("query dispatched"), o.removeListener("error", c), !u)
                  return u = true, o.release(h), h ? n(h) : n(
                    void 0,
                    l
                  );
              });
            } catch (h) {
              return o.release(h), n(h);
            }
          }), i.result;
        }
        end(e) {
          if (this.log("ending"), this.ending) {
            let n = new Error("Called end on pool more than once");
            return e ? e(n) : this.Promise.reject(n);
          }
          this.ending = true;
          let t = At(this.Promise, e);
          return this._endCallback = t.callback, this._pulseQueue(), t.result;
        }
        get waitingCount() {
          return this._pendingQueue.length;
        }
        get idleCount() {
          return this._idle.length;
        }
        get expiredCount() {
          return this._clients.reduce((e, t) => e + (this._expired.has(t) ? 1 : 0), 0);
        }
        get totalCount() {
          return this._clients.length;
        }
      }, "gn");
      a(gn, "Pool");
      var dn = gn;
      Fs.exports = dn;
    });
    Ds = {};
    ie(Ds, { default: /* @__PURE__ */ __name(() => Cc, "default") });
    ks = z(() => {
      "use strict";
      p();
      Cc = {};
    });
    Us = I((pf, Tc) => {
      Tc.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: [
        "database",
        "libpq",
        "pg",
        "postgre",
        "postgres",
        "postgresql",
        "rdbms"
      ], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: {
        "buffer-writer": "2.0.0",
        "packet-reader": "1.0.0",
        "pg-connection-string": "^2.5.0",
        "pg-pool": "^3.5.2",
        "pg-protocol": "^1.5.0",
        "pg-types": "^2.1.0",
        pgpass: "1.x"
      }, devDependencies: { async: "2.6.4", bluebird: "3.5.2", co: "4.6.0", "pg-copy-streams": "0.3.0" }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: {
        "pg-native": { optional: true }
      }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
    });
    qs = I((df, Ns) => {
      "use strict";
      p();
      var Os = we().EventEmitter, Ic = (He(), N(je)), wn = et(), qe = Ns.exports = function(r, e, t) {
        Os.call(this), r = wn.normalizeQueryConfig(r, e, t), this.text = r.text, this.values = r.values, this.name = r.name, this.callback = r.callback, this.state = "new", this._arrayMode = r.rowMode === "array", this._emitRowEvents = false, this.on("newListener", function(n) {
          n === "row" && (this._emitRowEvents = true);
        }.bind(this));
      };
      Ic.inherits(
        qe,
        Os
      );
      var Pc = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
      qe.prototype.handleError = function(r) {
        var e = this.native.pq.resultErrorFields();
        if (e)
          for (var t in e) {
            var n = Pc[t] || t;
            r[n] = e[t];
          }
        this.callback ? this.callback(r) : this.emit("error", r), this.state = "error";
      };
      qe.prototype.then = function(r, e) {
        return this._getPromise().then(r, e);
      };
      qe.prototype.catch = function(r) {
        return this._getPromise().catch(r);
      };
      qe.prototype._getPromise = function() {
        return this._promise ? this._promise : (this._promise = new Promise(function(r, e) {
          this._once("end", r), this._once(
            "error",
            e
          );
        }.bind(this)), this._promise);
      };
      qe.prototype.submit = function(r) {
        this.state = "running";
        var e = this;
        this.native = r.native, r.native.arrayMode = this._arrayMode;
        var t = a(
          function(s, o, u) {
            if (r.native.arrayMode = false, x(function() {
              e.emit("_done");
            }), s)
              return e.handleError(s);
            e._emitRowEvents && (u.length > 1 ? o.forEach((c, h) => {
              c.forEach((l) => {
                e.emit(
                  "row",
                  l,
                  u[h]
                );
              });
            }) : o.forEach(function(c) {
              e.emit("row", c, u);
            })), e.state = "end", e.emit(
              "end",
              u
            ), e.callback && e.callback(null, u);
          },
          "after"
        );
        if (m.domain && (t = m.domain.bind(
          t
        )), this.name) {
          this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error(
            "You supplied %s (%s)",
            this.name,
            this.name.length
          ), console.error("This can cause conflicts and silent errors executing queries"));
          var n = (this.values || []).map(wn.prepareValue);
          if (r.namedQueries[this.name]) {
            if (this.text && r.namedQueries[this.name] !== this.text) {
              let s = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
              return t(s);
            }
            return r.native.execute(this.name, n, t);
          }
          return r.native.prepare(
            this.name,
            this.text,
            n.length,
            function(s) {
              return s ? t(s) : (r.namedQueries[e.name] = e.text, e.native.execute(e.name, n, t));
            }
          );
        } else if (this.values) {
          if (!Array.isArray(this.values)) {
            let s = new Error("Query values must be an array");
            return t(s);
          }
          var i = this.values.map(wn.prepareValue);
          r.native.query(this.text, i, t);
        } else
          r.native.query(this.text, t);
      };
    });
    Hs = I((wf, js) => {
      "use strict";
      p();
      var Bc = (ks(), N(Ds)), Lc = mt(), gf = Us(), Qs = we().EventEmitter, Rc = (He(), N(je)), Fc = gt(), Ws = qs(), J = js.exports = function(r) {
        Qs.call(this), r = r || {}, this._Promise = r.Promise || S.Promise, this._types = new Lc(r.types), this.native = new Bc({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
        var e = this.connectionParameters = new Fc(
          r
        );
        this.user = e.user, Object.defineProperty(this, "password", {
          configurable: true,
          enumerable: false,
          writable: true,
          value: e.password
        }), this.database = e.database, this.host = e.host, this.port = e.port, this.namedQueries = {};
      };
      J.Query = Ws;
      Rc.inherits(J, Qs);
      J.prototype._errorAllQueries = function(r) {
        let e = a(
          (t) => {
            m.nextTick(() => {
              t.native = this.native, t.handleError(r);
            });
          },
          "enqueueError"
        );
        this._hasActiveQuery() && (e(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(e), this._queryQueue.length = 0;
      };
      J.prototype._connect = function(r) {
        var e = this;
        if (this._connecting) {
          m.nextTick(() => r(new Error("Client has already been connected. You cannot reuse a client.")));
          return;
        }
        this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(t, n) {
          if (t)
            return r(
              t
            );
          e.native.connect(n, function(i) {
            if (i)
              return e.native.end(), r(i);
            e._connected = true, e.native.on("error", function(s) {
              e._queryable = false, e._errorAllQueries(s), e.emit("error", s);
            }), e.native.on("notification", function(s) {
              e.emit("notification", { channel: s.relname, payload: s.extra });
            }), e.emit("connect"), e._pulseQueryQueue(true), r();
          });
        });
      };
      J.prototype.connect = function(r) {
        if (r) {
          this._connect(r);
          return;
        }
        return new this._Promise(
          (e, t) => {
            this._connect((n) => {
              n ? t(n) : e();
            });
          }
        );
      };
      J.prototype.query = function(r, e, t) {
        var n, i, s, o, u;
        if (r == null)
          throw new TypeError("Client was passed a null or undefined query");
        if (typeof r.submit == "function")
          s = r.query_timeout || this.connectionParameters.query_timeout, i = n = r, typeof e == "function" && (r.callback = e);
        else if (s = this.connectionParameters.query_timeout, n = new Ws(r, e, t), !n.callback) {
          let c, h;
          i = new this._Promise((l, d) => {
            c = l, h = d;
          }), n.callback = (l, d) => l ? h(l) : c(d);
        }
        return s && (u = n.callback, o = setTimeout(() => {
          var c = new Error("Query read timeout");
          m.nextTick(() => {
            n.handleError(c, this.connection);
          }), u(c), n.callback = () => {
          };
          var h = this._queryQueue.indexOf(n);
          h > -1 && this._queryQueue.splice(h, 1), this._pulseQueryQueue();
        }, s), n.callback = (c, h) => {
          clearTimeout(o), u(c, h);
        }), this._queryable ? this._ending ? (n.native = this.native, m.nextTick(() => {
          n.handleError(
            new Error("Client was closed and is not queryable")
          );
        }), i) : (this._queryQueue.push(
          n
        ), this._pulseQueryQueue(), i) : (n.native = this.native, m.nextTick(() => {
          n.handleError(
            new Error("Client has encountered a connection error and is not queryable")
          );
        }), i);
      };
      J.prototype.end = function(r) {
        var e = this;
        this._ending = true, this._connected || this.once(
          "connect",
          this.end.bind(this, r)
        );
        var t;
        return r || (t = new this._Promise(function(n, i) {
          r = a((s) => s ? i(s) : n(), "cb");
        })), this.native.end(function() {
          e._errorAllQueries(new Error(
            "Connection terminated"
          )), m.nextTick(() => {
            e.emit("end"), r && r();
          });
        }), t;
      };
      J.prototype._hasActiveQuery = function() {
        return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
      };
      J.prototype._pulseQueryQueue = function(r) {
        if (this._connected && !this._hasActiveQuery()) {
          var e = this._queryQueue.shift();
          if (!e) {
            r || this.emit("drain");
            return;
          }
          this._activeQuery = e, e.submit(this);
          var t = this;
          e.once(
            "_done",
            function() {
              t._pulseQueryQueue();
            }
          );
        }
      };
      J.prototype.cancel = function(r) {
        this._activeQuery === r ? this.native.cancel(function() {
        }) : this._queryQueue.indexOf(r) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
      };
      J.prototype.ref = function() {
      };
      J.prototype.unref = function() {
      };
      J.prototype.setTypeParser = function(r, e, t) {
        return this._types.setTypeParser(r, e, t);
      };
      J.prototype.getTypeParser = function(r, e) {
        return this._types.getTypeParser(r, e);
      };
    });
    bn = I((xf, Gs) => {
      "use strict";
      p();
      Gs.exports = Hs();
    });
    Ct = I((Ef, rt) => {
      "use strict";
      p();
      var Mc = Bs(), Dc = Xe(), kc = hn(), Uc = Ms(), { DatabaseError: Oc } = an(), Nc = a((r) => {
        var e;
        return e = /* @__PURE__ */ __name2(class extends Uc {
          constructor(n) {
            super(n, r);
          }
        }, "e"), a(e, "BoundPool"), e;
      }, "poolFactory"), Sn = a(function(r) {
        this.defaults = Dc, this.Client = r, this.Query = this.Client.Query, this.Pool = Nc(this.Client), this._pools = [], this.Connection = kc, this.types = Je(), this.DatabaseError = Oc;
      }, "PG");
      typeof m.env.NODE_PG_FORCE_NATIVE < "u" ? rt.exports = new Sn(bn()) : (rt.exports = new Sn(Mc), Object.defineProperty(rt.exports, "native", { configurable: true, enumerable: false, get() {
        var r = null;
        try {
          r = new Sn(bn());
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND")
            throw e;
        }
        return Object.defineProperty(rt.exports, "native", { value: r }), r;
      } }));
    });
    p();
    Tt = Te(Ct());
    wt();
    p();
    pr();
    wt();
    Ks = Te(et());
    zs = Te(mt());
    xn = /* @__PURE__ */ __name2(class xn2 extends Error {
      static {
        __name(this, "xn2");
      }
      constructor() {
        super(...arguments);
        _(this, "name", "NeonDbError");
        _(this, "severity");
        _(this, "code");
        _(this, "detail");
        _(this, "hint");
        _(
          this,
          "position"
        );
        _(this, "internalPosition");
        _(this, "internalQuery");
        _(this, "where");
        _(this, "schema");
        _(this, "table");
        _(this, "column");
        _(this, "dataType");
        _(
          this,
          "constraint"
        );
        _(this, "file");
        _(this, "line");
        _(this, "routine");
        _(this, "sourceError");
      }
    }, "xn");
    a(xn, "NeonDbError");
    Ae = xn;
    $s = "transaction() expects an array of queries, or a function returning an array of queries";
    qc = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
    __name2(Ys, "Ys");
    a(Ys, "neon");
    __name2(Qc, "Qc");
    a(Qc, "createNeonQueryPromise");
    __name2(Vs, "Vs");
    a(Vs, "processQueryResult");
    Js = Te(gt());
    Qe = Te(Ct());
    En = /* @__PURE__ */ __name2(class En2 extends Tt.Client {
      static {
        __name(this, "En2");
      }
      constructor(t) {
        super(t);
        this.config = t;
      }
      get neonConfig() {
        return this.connection.stream;
      }
      connect(t) {
        let { neonConfig: n } = this;
        n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && n.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
        let i = this.config?.host !== void 0 || this.config?.connectionString !== void 0 || m.env.PGHOST !== void 0, s = m.env.USER ?? m.env.USERNAME;
        if (!i && this.host === "localhost" && this.user === s && this.database === s && this.password === null)
          throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
        let o = super.connect(t), u = n.pipelineTLS && this.ssl, c = n.pipelineConnect === "password";
        if (!u && !n.pipelineConnect)
          return o;
        let h = this.connection;
        if (u && h.on("connect", () => h.stream.emit("data", "S")), c) {
          h.removeAllListeners(
            "authenticationCleartextPassword"
          ), h.removeAllListeners("readyForQuery"), h.once(
            "readyForQuery",
            () => h.on("readyForQuery", this._handleReadyForQuery.bind(this))
          );
          let l = this.ssl ? "sslconnect" : "connect";
          h.on(l, () => {
            this._handleAuthCleartextPassword(), this._handleReadyForQuery();
          });
        }
        return o;
      }
      async _handleAuthSASLContinue(t) {
        let n = this.saslSession, i = this.password, s = t.data;
        if (n.message !== "SASLInitialResponse" || typeof i != "string" || typeof s != "string")
          throw new Error("SASL: protocol error");
        let o = Object.fromEntries(s.split(",").map((U) => {
          if (!/^.=/.test(U))
            throw new Error("SASL: Invalid attribute pair entry");
          let K = U[0], le = U.substring(2);
          return [K, le];
        })), u = o.r, c = o.s, h = o.i;
        if (!u || !/^[!-+--~]+$/.test(u))
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
        if (!c || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(c))
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");
        if (!h || !/^[1-9][0-9]*$/.test(h))
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");
        if (!u.startsWith(n.clientNonce))
          throw new Error(
            "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce"
          );
        if (u.length === n.clientNonce.length)
          throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
        let l = parseInt(h, 10), d = y.from(c, "base64"), b = new TextEncoder(), C = b.encode(i), B = await g.subtle.importKey("raw", C, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), W = new Uint8Array(await g.subtle.sign("HMAC", B, y.concat([d, y.from(
          [0, 0, 0, 1]
        )]))), X = W;
        for (var de = 0; de < l - 1; de++)
          W = new Uint8Array(await g.subtle.sign(
            "HMAC",
            B,
            W
          )), X = y.from(X.map((U, K) => X[K] ^ W[K]));
        let A = X, w = await g.subtle.importKey(
          "raw",
          A,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        ), P = new Uint8Array(await g.subtle.sign("HMAC", w, b.encode("Client Key"))), V = await g.subtle.digest(
          "SHA-256",
          P
        ), k = "n=*,r=" + n.clientNonce, j = "r=" + u + ",s=" + c + ",i=" + l, ce = "c=biws,r=" + u, ee = k + "," + j + "," + ce, R = await g.subtle.importKey(
          "raw",
          V,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        );
        var G = new Uint8Array(await g.subtle.sign("HMAC", R, b.encode(ee))), he = y.from(P.map((U, K) => P[K] ^ G[K])), ye = he.toString("base64");
        let xe = await g.subtle.importKey(
          "raw",
          A,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        ), me = await g.subtle.sign(
          "HMAC",
          xe,
          b.encode("Server Key")
        ), se = await g.subtle.importKey("raw", me, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
        var oe = y.from(await g.subtle.sign(
          "HMAC",
          se,
          b.encode(ee)
        ));
        n.message = "SASLResponse", n.serverSignature = oe.toString("base64"), n.response = ce + ",p=" + ye, this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
      }
    }, "En");
    a(En, "NeonClient");
    vn = En;
    __name2(Wc, "Wc");
    a(Wc, "promisify");
    _n = /* @__PURE__ */ __name2(class _n2 extends Tt.Pool {
      static {
        __name(this, "_n2");
      }
      constructor() {
        super(...arguments);
        _(this, "Client", vn);
        _(this, "hasFetchUnsupportedListeners", false);
      }
      on(t, n) {
        return t !== "error" && (this.hasFetchUnsupportedListeners = true), super.on(t, n);
      }
      query(t, n, i) {
        if (!_e.poolQueryViaFetch || this.hasFetchUnsupportedListeners || typeof t == "function")
          return super.query(t, n, i);
        typeof n == "function" && (i = n, n = void 0);
        let s = Wc(
          this.Promise,
          i
        );
        i = s.callback;
        try {
          let o = new Js.default(this.options), u = encodeURIComponent, c = encodeURI, h = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`, l = typeof t == "string" ? t : t.text, d = n ?? t.values ?? [];
          Ys(h, { fullResults: true, arrayMode: t.rowMode === "array" })(l, d, { types: t.types ?? this.options?.types }).then((C) => i(void 0, C)).catch((C) => i(
            C
          ));
        } catch (o) {
          i(o);
        }
        return s.result;
      }
    }, "_n");
    a(_n, "NeonPool");
    export_ClientBase = Qe.ClientBase;
    export_Connection = Qe.Connection;
    export_DatabaseError = Qe.DatabaseError;
    export_Query = Qe.Query;
    export_defaults = Qe.defaults;
    export_types = Qe.types;
  }
});
function createDatabase(env2) {
  if (!env2?.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  const sql = Ys(env2.DATABASE_URL, connectionConfig);
  return {
    // Raw SQL query execution with transaction support
    async query(text, params = []) {
      try {
        const result = await sql(text, params);
        return { success: true, data: result };
      } catch (error3) {
        console.error("Database query error:", {
          query: text,
          params,
          error: error3.message,
          stack: error3.stack
        });
        return {
          success: false,
          error: error3.message,
          code: error3.code || "UNKNOWN_ERROR"
        };
      }
    },
    // Transaction wrapper
    async transaction(queries) {
      try {
        const results = [];
        await sql.transaction(async (trx) => {
          for (const { query, params } of queries) {
            const result = await trx(query, params);
            results.push(result);
          }
        });
        return { success: true, data: results };
      } catch (error3) {
        console.error("Transaction error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Enhanced find by email with caching
    async findByEmail(table3, email) {
      try {
        const result = await sql`
          SELECT * FROM ${sql(table3)} 
          WHERE LOWER(email) = LOWER(${email}) 
          AND active = true 
          LIMIT 1
        `;
        return {
          success: true,
          data: result.length > 0 ? result[0] : null
        };
      } catch (error3) {
        console.error("Database findByEmail error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Enhanced find by ID with type checking
    async findById(table3, id) {
      try {
        if (!id) {
          return { success: false, error: "ID is required" };
        }
        const result = await sql`
          SELECT * FROM ${sql(table3)} 
          WHERE id = ${id} 
          LIMIT 1
        `;
        return {
          success: true,
          data: result.length > 0 ? result[0] : null
        };
      } catch (error3) {
        console.error("Database findById error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Enhanced insert with conflict handling
    async insert(table3, data, options = {}) {
      try {
        const { onConflict = "error", returning = "*" } = options;
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_2, i) => `$${i + 1}`).join(", ");
        let query = `INSERT INTO ${table3} (${columns.join(", ")}) VALUES (${placeholders})`;
        if (onConflict === "ignore") {
          query += " ON CONFLICT DO NOTHING";
        } else if (onConflict === "update") {
          const updateClause = columns.filter((col) => col !== "id" && col !== "created_at").map((col) => `${col} = EXCLUDED.${col}`).join(", ");
          if (updateClause) {
            query += ` ON CONFLICT (id) DO UPDATE SET ${updateClause}`;
          }
        }
        query += ` RETURNING ${returning}`;
        const result = await sql(query, values);
        return {
          success: true,
          data: result.length > 0 ? result[0] : null
        };
      } catch (error3) {
        console.error("Database insert error:", error3);
        if (error3.code === "23505") {
          return { success: false, error: "Record already exists", code: "DUPLICATE_ERROR" };
        }
        return { success: false, error: error3.message };
      }
    },
    // Enhanced update with optimistic locking
    async update(table3, id, data, options = {}) {
      try {
        const { version: version2 = null, returning = "*" } = options;
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
        let whereClause = `id = $${values.length + 1}`;
        const queryParams = [...values, id];
        if (version2 !== null) {
          whereClause += ` AND version = $${queryParams.length + 1}`;
          queryParams.push(version2);
        }
        const finalSetClause = `${setClause}, updated_at = NOW()`;
        const query = `UPDATE ${table3} SET ${finalSetClause} WHERE ${whereClause} RETURNING ${returning}`;
        const result = await sql(query, queryParams);
        if (result.length === 0) {
          return {
            success: false,
            error: version2 !== null ? "Record was modified by another user" : "Record not found",
            code: version2 !== null ? "VERSION_CONFLICT" : "NOT_FOUND"
          };
        }
        return {
          success: true,
          data: result[0]
        };
      } catch (error3) {
        console.error("Database update error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Soft delete with audit trail
    async delete(table3, id, options = {}) {
      try {
        const { hard = false, deletedBy = null } = options;
        if (hard) {
          const result = await sql`DELETE FROM ${sql(table3)} WHERE id = ${id} RETURNING *`;
          return {
            success: true,
            data: result.length > 0 ? result[0] : null
          };
        } else {
          const updateData = {
            deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
            active: false
          };
          if (deletedBy) {
            updateData.deleted_by = deletedBy;
          }
          return await this.update(table3, id, updateData);
        }
      } catch (error3) {
        console.error("Database delete error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Enhanced list with advanced filtering and sorting
    async list(table3, options = {}) {
      try {
        const {
          page = 1,
          limit = 10,
          where = "",
          orderBy = "created_at DESC",
          search = null,
          searchFields = [],
          filters = {},
          includeDeleted = false
        } = options;
        const offset = (page - 1) * limit;
        let conditions = [];
        let params = [];
        let paramIndex = 1;
        if (!includeDeleted) {
          conditions.push("(deleted_at IS NULL OR active = true)");
        }
        if (where) {
          conditions.push(where);
        }
        if (search && searchFields.length > 0) {
          const searchConditions = searchFields.map(
            (field) => `LOWER(${field}::text) LIKE LOWER($${paramIndex})`
          ).join(" OR ");
          conditions.push(`(${searchConditions})`);
          params.push(`%${search}%`);
          paramIndex++;
        }
        for (const [field, value] of Object.entries(filters)) {
          if (value !== null && value !== void 0) {
            if (Array.isArray(value)) {
              const placeholders = value.map(() => `$${paramIndex++}`).join(", ");
              conditions.push(`${field} IN (${placeholders})`);
              params.push(...value);
            } else {
              conditions.push(`${field} = $${paramIndex++}`);
              params.push(value);
            }
          }
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const baseQuery = `FROM ${table3} ${whereClause}`;
        const dataQuery = `SELECT * ${baseQuery} ORDER BY ${orderBy} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
        const [data, countResult] = await Promise.all([
          sql(dataQuery, [...params, limit, offset]),
          sql(countQuery, params)
        ]);
        const total = parseInt(countResult[0].total);
        const totalPages = Math.ceil(total / limit);
        return {
          success: true,
          data,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        };
      } catch (error3) {
        console.error("Database list error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Bulk operations
    async bulkInsert(table3, records, options = {}) {
      try {
        const { batchSize = 100, onConflict = "error" } = options;
        const results = [];
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map((record) => this.insert(table3, record, { onConflict }))
          );
          results.push(...batchResults);
        }
        return { success: true, data: results };
      } catch (error3) {
        console.error("Bulk insert error:", error3);
        return { success: false, error: error3.message };
      }
    },
    // Health check
    async healthCheck() {
      try {
        const result = await sql`SELECT 1 as health_check, NOW() as timestamp`;
        return {
          success: true,
          data: {
            status: "healthy",
            timestamp: result[0].timestamp,
            connection: "active"
          }
        };
      } catch (error3) {
        console.error("Database health check error:", error3);
        return {
          success: false,
          error: error3.message,
          data: {
            status: "unhealthy",
            connection: "failed"
          }
        };
      }
    },
    // Database statistics
    async getStats() {
      try {
        const queries = [
          "SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del FROM pg_stat_user_tables",
          "SELECT COUNT(*) as active_connections FROM pg_stat_activity WHERE state = 'active'",
          "SELECT pg_database_size(current_database()) as db_size"
        ];
        const [tableStats, connectionStats, sizeStats] = await Promise.all(
          queries.map((query) => sql(query))
        );
        return {
          success: true,
          data: {
            tables: tableStats,
            active_connections: connectionStats[0].active_connections,
            database_size: sizeStats[0].db_size
          }
        };
      } catch (error3) {
        console.error("Database stats error:", error3);
        return { success: false, error: error3.message };
      }
    }
  };
}
__name(createDatabase, "createDatabase");
var connectionConfig;
var init_database_workers = __esm({
  "src/config/database-workers.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_serverless();
    connectionConfig = {
      connectionTimeoutMillis: 3e4,
      idleTimeoutMillis: 3e4,
      max: 10
      // max connections in pool
    };
    __name2(createDatabase, "createDatabase");
  }
});
var auth_workers_exports = {};
__export(auth_workers_exports, {
  authenticateToken: /* @__PURE__ */ __name(() => authenticateToken, "authenticateToken"),
  authenticateUser: /* @__PURE__ */ __name(() => authenticateUser, "authenticateUser"),
  authenticateAdminOrUser: /* @__PURE__ */ __name(() => authenticateAdminOrUser, "authenticateAdminOrUser"),
  comparePassword: /* @__PURE__ */ __name(() => comparePassword, "comparePassword"),
  generateToken: /* @__PURE__ */ __name(() => generateToken, "generateToken"),
  hashPassword: /* @__PURE__ */ __name(() => hashPassword, "hashPassword"),
  optionalAuth: /* @__PURE__ */ __name(() => optionalAuth, "optionalAuth"),
  requireAdmin: /* @__PURE__ */ __name(() => requireAdmin, "requireAdmin")
});
async function importKey(secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}
__name(importKey, "importKey");
function base64UrlEncode(buffer) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlDecode(str) {
  str += "=".repeat((4 - str.length % 4) % 4);
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
__name(base64UrlDecode, "base64UrlDecode");
async function generateToken(payload, secret = "default-secret") {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const encoder = new TextEncoder();
  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const encodedSignature = base64UrlEncode(signature);
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}
__name(generateToken, "generateToken");
async function verifyToken(token, secret = "default-secret") {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return null;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await importKey(secret);
    const signature = base64UrlDecode(signatureB64);
    const isValid2 = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!isValid2) {
      return null;
    }
    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) {
      return null;
    }
    return payload;
  } catch (error3) {
    console.error("Token verification error:", error3);
    return null;
  }
}
__name(verifyToken, "verifyToken");
async function hashPassword(password, salt = null) {
  const encoder = new TextEncoder();
  if (!salt) {
    salt = crypto.getRandomValues(new Uint8Array(16));
  } else if (typeof salt === "string") {
    salt = encoder.encode(salt);
  }
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(new Uint8Array(salt));
  const combined = saltArray.concat(hashArray);
  return btoa(String.fromCharCode(...combined));
}
__name(hashPassword, "hashPassword");
async function comparePassword(password, hash) {
  try {
    const combined = Uint8Array.from(atob(hash), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 1e5,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    const computedHash = new Uint8Array(hashBuffer);
    if (computedHash.length !== storedHash.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash[i] ^ storedHash[i];
    }
    return result === 0;
  } catch (error3) {
    console.error("Password comparison error:", error3);
    return false;
  }
}
__name(comparePassword, "comparePassword");
var authenticateToken;
var authenticateUser;
var authenticateAdminOrUser;
var optionalAuth;
var requireAdmin;
var init_auth_workers = __esm({
  "src/middleware/auth-workers.js"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_database_workers();
    __name2(importKey, "importKey");
    __name2(base64UrlEncode, "base64UrlEncode");
    __name2(base64UrlDecode, "base64UrlDecode");
    __name2(generateToken, "generateToken");
    __name2(verifyToken, "verifyToken");
    __name2(hashPassword, "hashPassword");
    __name2(comparePassword, "comparePassword");
    authenticateToken = /* @__PURE__ */ __name2(async (c, next) => {
      try {
        const authHeader = c.req.header("authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
          return c.json({
            success: false,
            message: "Access token is required"
          }, 401);
        }
        const secret = c.env?.JWT_SECRET || "default-secret";
        const payload = await verifyToken(token, secret);
        if (!payload) {
          return c.json({
            success: false,
            message: "Invalid or expired token"
          }, 403);
        }
        const db = createDatabase(c.env);
        const userResult = await db.query("SELECT * FROM admin_users WHERE id = $1 AND active = true", [payload.userId]);
        if (!userResult.success || userResult.data.length === 0) {
          return c.json({
            success: false,
            message: "User not found"
          }, 403);
        }
        c.set("user", userResult.data[0]);
        c.set("isAuthenticated", true);
        await next();
      } catch (error3) {
        console.error("Authentication error:", error3);
        return c.json({
          success: false,
          message: "Authentication failed"
        }, 500);
      }
    }, "authenticateToken");
    authenticateUser = /* @__PURE__ */ __name2(async (c, next) => {
      try {
        const authHeader = c.req.header("authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
          return c.json({
            success: false,
            message: "Access token is required"
          }, 401);
        }
        const secret = c.env?.JWT_SECRET || "default-secret";
        const payload = await verifyToken(token, secret);
        if (!payload) {
          return c.json({
            success: false,
            message: "Invalid or expired token"
          }, 403);
        }
        const db = createDatabase(c.env);
        const userResult = await db.query("SELECT * FROM users WHERE id = $1 AND is_active = true", [payload.userId]);
        if (!userResult.success || userResult.data.length === 0) {
          return c.json({
            success: false,
            message: "User not found"
          }, 403);
        }
        c.set("user", payload);
        c.set("isAuthenticated", true);
        await next();
      } catch (error3) {
        console.error("User authentication error:", error3);
        return c.json({
          success: false,
          message: "Authentication failed"
        }, 500);
      }
    }, "authenticateUser");
    authenticateAdminOrUser = /* @__PURE__ */ __name2(async (c, next) => {
      try {
        const authHeader = c.req.header("authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
          return c.json({
            success: false,
            message: "Access token is required"
          }, 401);
        }
        const secret = c.env?.JWT_SECRET || "default-secret";
        const payload = await verifyToken(token, secret);
        if (!payload) {
          return c.json({
            success: false,
            message: "Invalid or expired token"
          }, 403);
        }
        const db = createDatabase(c.env);
        let userResult = await db.query("SELECT * FROM admin_users WHERE id = $1 AND active = true", [payload.userId]);
        if (!userResult.success || userResult.data.length === 0) {
          userResult = await db.query("SELECT * FROM users WHERE id = $1 AND is_active = true", [payload.userId]);
        }
        if (!userResult.success || userResult.data.length === 0) {
          return c.json({
            success: false,
            message: "User not found"
          }, 403);
        }
        c.set("user", payload);
        c.set("isAuthenticated", true);
        await next();
      } catch (error3) {
        console.error("Admin/User authentication error:", error3);
        return c.json({
          success: false,
          message: "Authentication failed"
        }, 500);
      }
    }, "authenticateAdminOrUser");
    optionalAuth = /* @__PURE__ */ __name2(async (c, next) => {
      try {
        const authHeader = c.req.header("authorization");
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
          const secret = c.env?.JWT_SECRET || "default-secret";
          const payload = verifyToken(token, secret);
          if (payload) {
            const db = createDatabase(c.env);
            const userResult = await db.findById("adminUsers", payload.userId);
            if (userResult.success && userResult.data) {
              c.set("user", userResult.data);
              c.set("isAuthenticated", true);
            }
          }
        }
        if (!c.get("isAuthenticated")) {
          c.set("user", null);
          c.set("isAuthenticated", false);
        }
        await next();
      } catch (error3) {
        console.error("Optional auth error:", error3);
        c.set("user", null);
        c.set("isAuthenticated", false);
        await next();
      }
    }, "optionalAuth");
    requireAdmin = /* @__PURE__ */ __name2(async (c, next) => {
      const user = c.get("user");
      if (!user || user.role !== "admin") {
        return c.json({
          success: false,
          message: "Admin access required"
        }, 403);
      }
      await next();
    }, "requireAdmin");
  }
});
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name2((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
    __name2(dispatch, "dispatch");
  };
}, "compose");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = Symbol();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var parseBody = /* @__PURE__ */ __name2(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
__name2(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
__name2(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name2((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name2((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name2((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name2((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name2((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name2((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name2((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name2((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name2((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name2((request) => {
  const url = request.url;
  const start = url.indexOf(
    "/",
    url.charCodeAt(9) === 58 ? 13 : 8
  );
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name2((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name2((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name2((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v2, i, a2) => a2.indexOf(v2) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name2((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name2((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name2((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;
var tryDecodeURIComponent = /* @__PURE__ */ __name2((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = /* @__PURE__ */ __name2(class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : void 0;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
}, "HonoRequest");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name2((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name2(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name2((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = /* @__PURE__ */ __name2(class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v2] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v2);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v2] of Object.entries(headers)) {
        if (typeof v2 === "string") {
          responseHeaders.set(k, v2);
        } else {
          responseHeaders.delete(k);
          for (const v22 of v2) {
            responseHeaders.append(k, v22);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name2((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
}, "Context");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = /* @__PURE__ */ __name2(class extends Error {
}, "UnsupportedPathError");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
var notFoundHandler = /* @__PURE__ */ __name2((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name2((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = /* @__PURE__ */ __name2(class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p2 of [path].flat()) {
        this.#path = p2;
        for (const m2 of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m2.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name2(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name2((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name2(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
}, "Hono");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a2, b) {
  if (a2.length === 1) {
    return b.length === 1 ? a2 < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a2 === ONLY_WILDCARD_REG_EXP_STR || a2 === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a2 === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a2.length === b.length ? a2 < b ? -1 : 1 : b.length - a2.length;
}
__name(compareKey, "compareKey");
__name2(compareKey, "compareKey");
var Node = /* @__PURE__ */ __name2(class {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, "Node");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = /* @__PURE__ */ __name2(class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m2) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m2];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_2, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, "Trie");
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_2, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
__name2(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
__name2(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
__name2(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a2, b) => b.length - a2.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
__name2(findMiddleware, "findMiddleware");
var RegExpRouter = /* @__PURE__ */ __name2(class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p2) => {
          handlerMap[method][p2] = [...handlerMap[METHOD_NAME_ALL][p2]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m2) => {
          middleware[m2][path] ||= findMiddleware(middleware[m2], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          Object.keys(middleware[m2]).forEach((p2) => {
            re.test(p2) && middleware[m2][p2].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          Object.keys(routes[m2]).forEach(
            (p2) => re.test(p2) && routes[m2][p2].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          routes[m2][path2] ||= [
            ...findMiddleware(middleware[m2], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m2][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
}, "RegExpRouter");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = /* @__PURE__ */ __name2(class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
}, "SmartRouter");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = /* @__PURE__ */ __name2(class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m2 = /* @__PURE__ */ Object.create(null);
      m2[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m2];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p2 = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p2, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p2;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v2, i, a2) => a2.indexOf(v2) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m2 = node.#methods[i];
      const handlerSet = m2[method] || m2[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m2 = matcher.exec(restPathString);
            if (m2) {
              params[name] = m2[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m2[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a2, b) => {
        return a2.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
}, "Node");
var TrieRouter = /* @__PURE__ */ __name2(class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
}, "TrieRouter");
var Hono2 = /* @__PURE__ */ __name2(class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
}, "Hono");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  __name2(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  __name2(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  __name2(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_2, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name2((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name2((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class extends Error {
  static {
    __name(this, "ZodError");
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  get errors() {
    return this.issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name2((error3) => {
      for (const issue of error3.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
__name2(ZodError, "ZodError");
ZodError.create = (issues) => {
  const error3 = new ZodError(issues);
  return error3;
};
var errorMap = /* @__PURE__ */ __name2((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, "errorMap");
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
__name2(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");
__name2(getErrorMap, "getErrorMap");
var makeIssue = /* @__PURE__ */ __name2((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  let errorMessage = "";
  const maps = errorMaps.filter((m2) => !!m2).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: issueData.message || errorMessage
  };
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      getErrorMap(),
      errorMap
      // then global default map
    ].filter((x2) => !!x2)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
__name2(addIssueToContext, "addIssueToContext");
var ParseStatus = class {
  static {
    __name(this, "ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      syncPairs.push({
        key: await pair.key,
        value: await pair.value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
__name2(ParseStatus, "ParseStatus");
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name2((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name2((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name2((x2) => x2.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name2((x2) => x2.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name2((x2) => x2.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name2((x2) => typeof Promise !== "undefined" && x2 instanceof Promise, "isAsync");
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var ParseInputLazyPath = class {
  static {
    __name(this, "ParseInputLazyPath");
  }
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
__name2(ParseInputLazyPath, "ParseInputLazyPath");
var handleResult = /* @__PURE__ */ __name2((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error3 = new ZodError(ctx.common.issues);
        this._error = error3;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name2((iss, ctx) => {
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    if (typeof ctx.data === "undefined") {
      return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
    }
    return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
__name2(processCreateParams, "processCreateParams");
var ZodType = class {
  static {
    __name(this, "ZodType");
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name2((val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name2(() => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      }), "setError");
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this, this._def);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
__name2(ZodType, "ZodType");
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[a-z][a-z0-9]*$/;
var ulidRegex = /[0-9A-HJKMNP-TV-Z]{26}/;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
var ipv4Regex = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
var ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
var datetimeRegex = /* @__PURE__ */ __name2((args) => {
  if (args.precision) {
    if (args.offset) {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
    }
  } else if (args.precision === 0) {
    if (args.offset) {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
    }
  } else {
    if (args.offset) {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
    }
  }
}, "datetimeRegex");
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
__name2(isValidIP, "isValidIP");
var ZodString = class extends ZodType {
  static {
    __name(this, "ZodString");
  }
  constructor() {
    super(...arguments);
    this._regex = (regex, validation, message) => this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
    this.nonempty = (message) => this.min(1, errorUtil.errToObj(message));
    this.trim = () => new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
    this.toLowerCase = () => new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
    this.toUpperCase = () => new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(
        ctx2,
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        }
        //
      );
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
__name2(ZodString, "ZodString");
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
__name(floatSafeRemainder, "floatSafeRemainder");
__name2(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class extends ZodType {
  static {
    __name(this, "ZodNumber");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
__name2(ZodNumber, "ZodNumber");
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class extends ZodType {
  static {
    __name(this, "ZodBigInt");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = BigInt(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
__name2(ZodBigInt, "ZodBigInt");
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  static {
    __name(this, "ZodBoolean");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name2(ZodBoolean, "ZodBoolean");
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class extends ZodType {
  static {
    __name(this, "ZodDate");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
__name2(ZodDate, "ZodDate");
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  static {
    __name(this, "ZodSymbol");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name2(ZodSymbol, "ZodSymbol");
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  static {
    __name(this, "ZodUndefined");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name2(ZodUndefined, "ZodUndefined");
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  static {
    __name(this, "ZodNull");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name2(ZodNull, "ZodNull");
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  static {
    __name(this, "ZodAny");
  }
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
__name2(ZodAny, "ZodAny");
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  static {
    __name(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
__name2(ZodUnknown, "ZodUnknown");
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  static {
    __name(this, "ZodNever");
  }
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
__name2(ZodNever, "ZodNever");
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  static {
    __name(this, "ZodVoid");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
__name2(ZodVoid, "ZodVoid");
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class extends ZodType {
  static {
    __name(this, "ZodArray");
  }
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
__name2(ZodArray, "ZodArray");
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
__name2(deepPartialify, "deepPartialify");
var ZodObject = class extends ZodType {
  static {
    __name(this, "ZodObject");
  }
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          syncPairs.push({
            key,
            value: await pair.value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: /* @__PURE__ */ __name((issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }, "errorMap")
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...augmentation
      }), "shape")
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }), "shape"),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
__name2(ZodObject, "ZodObject");
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  static {
    __name(this, "ZodUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    __name2(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
__name2(ZodUnion, "ZodUnion");
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = /* @__PURE__ */ __name2((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return Object.keys(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else {
    return null;
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class extends ZodType {
  static {
    __name(this, "ZodDiscriminatedUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
__name2(ZodDiscriminatedUnion, "ZodDiscriminatedUnion");
function mergeValues(a2, b) {
  const aType = getParsedType(a2);
  const bType = getParsedType(b);
  if (a2 === b) {
    return { valid: true, data: a2 };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a2).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a2, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a2[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a2.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a2.length; index++) {
      const itemA = a2[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a2 === +b) {
    return { valid: true, data: a2 };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
__name2(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  static {
    __name(this, "ZodIntersection");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name2((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
__name2(ZodIntersection, "ZodIntersection");
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class extends ZodType {
  static {
    __name(this, "ZodTuple");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x2) => !!x2);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
};
__name2(ZodTuple, "ZodTuple");
ZodTuple.create = (schemas2, params) => {
  if (!Array.isArray(schemas2)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas2,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class extends ZodType {
  static {
    __name(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key))
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
__name2(ZodRecord, "ZodRecord");
var ZodMap = class extends ZodType {
  static {
    __name(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
__name2(ZodMap, "ZodMap");
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class extends ZodType {
  static {
    __name(this, "ZodSet");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    __name2(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
__name2(ZodSet, "ZodSet");
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class extends ZodType {
  static {
    __name(this, "ZodFunction");
  }
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error3) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x2) => !!x2),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error3
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    __name2(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error3) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x2) => !!x2),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error3
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    __name2(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error3 = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error3.addIssue(makeArgsIssue(args, e));
          throw error3;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error3.addIssue(makeReturnsIssue(result, e));
          throw error3;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
__name2(ZodFunction, "ZodFunction");
var ZodLazy = class extends ZodType {
  static {
    __name(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
__name2(ZodLazy, "ZodLazy");
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  static {
    __name(this, "ZodLiteral");
  }
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
__name2(ZodLiteral, "ZodLiteral");
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
__name(createZodEnum, "createZodEnum");
__name2(createZodEnum, "createZodEnum");
var ZodEnum = class extends ZodType {
  static {
    __name(this, "ZodEnum");
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (this._def.values.indexOf(input.data) === -1) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values) {
    return ZodEnum.create(values);
  }
  exclude(values) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
  }
};
__name2(ZodEnum, "ZodEnum");
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  static {
    __name(this, "ZodNativeEnum");
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (nativeEnumValues.indexOf(input.data) === -1) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
__name2(ZodNativeEnum, "ZodNativeEnum");
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  static {
    __name(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
__name2(ZodPromise, "ZodPromise");
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  static {
    __name(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: /* @__PURE__ */ __name((arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      }, "addIssue"),
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.issues.length) {
        return {
          status: "dirty",
          value: ctx.data
        };
      }
      if (ctx.common.async) {
        return Promise.resolve(processed).then((processed2) => {
          return this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
        });
      } else {
        return this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name2((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
__name2(ZodEffects, "ZodEffects");
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  static {
    __name(this, "ZodOptional");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name2(ZodOptional, "ZodOptional");
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  static {
    __name(this, "ZodNullable");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
__name2(ZodNullable, "ZodNullable");
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  static {
    __name(this, "ZodDefault");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
__name2(ZodDefault, "ZodDefault");
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  static {
    __name(this, "ZodCatch");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
__name2(ZodCatch, "ZodCatch");
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  static {
    __name(this, "ZodNaN");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
__name2(ZodNaN, "ZodNaN");
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  static {
    __name(this, "ZodBranded");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
__name2(ZodBranded, "ZodBranded");
var ZodPipeline = class extends ZodType {
  static {
    __name(this, "ZodPipeline");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name2(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }, "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a2, b) {
    return new ZodPipeline({
      in: a2,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
__name2(ZodPipeline, "ZodPipeline");
var ZodReadonly = class extends ZodType {
  static {
    __name(this, "ZodReadonly");
  }
  _parse(input) {
    const result = this._def.innerType._parse(input);
    if (isValid(result)) {
      result.value = Object.freeze(result.value);
    }
    return result;
  }
};
__name2(ZodReadonly, "ZodReadonly");
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
var custom = /* @__PURE__ */ __name2((check, params = {}, fatal) => {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p2 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p2.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        const p22 = typeof p2 === "string" ? { message: p2 } : p2;
        ctx.addIssue({ code: "custom", ...p22, fatal: _fatal });
      }
    });
  return ZodAny.create();
}, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name2((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name2(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name2(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name2(() => booleanType().optional(), "oboolean");
var coerce = {
  string: /* @__PURE__ */ __name((arg) => ZodString.create({ ...arg, coerce: true }), "string"),
  number: /* @__PURE__ */ __name((arg) => ZodNumber.create({ ...arg, coerce: true }), "number"),
  boolean: /* @__PURE__ */ __name((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }), "boolean"),
  bigint: /* @__PURE__ */ __name((arg) => ZodBigInt.create({ ...arg, coerce: true }), "bigint"),
  date: /* @__PURE__ */ __name((arg) => ZodDate.create({ ...arg, coerce: true }), "date")
};
var NEVER = INVALID;
var z2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});
var schemas = {
  login: z2.object({
    email: z2.string().email("Invalid email format"),
    password: z2.string().min(6, "Password must be at least 6 characters")
  }),
  register: z2.object({
    email: z2.string().email("Invalid email format"),
    password: z2.string().min(8, "Password must be at least 8 characters"),
    name: z2.string().min(2, "Name must be at least 2 characters"),
    role: z2.enum(["admin", "user"]).optional().default("user")
  }),
  contact: z2.object({
    name: z2.string().min(2, "Name must be at least 2 characters"),
    email: z2.string().email("Invalid email format"),
    message: z2.string().min(10, "Message must be at least 10 characters"),
    phone: z2.string().optional()
  }),
  galleryItem: z2.object({
    title: z2.string().min(2, "Title must be at least 2 characters"),
    description: z2.string().optional(),
    imageUrl: z2.string().url("Invalid image URL"),
    category: z2.string().optional(),
    tags: z2.array(z2.string()).optional(),
    featured: z2.boolean().optional().default(false),
    active: z2.boolean().optional().default(true)
  }),
  event: z2.object({
    title: z2.string().min(2, "Title must be at least 2 characters"),
    description: z2.string().optional(),
    startDate: z2.string().datetime("Invalid start date"),
    endDate: z2.string().datetime("Invalid end date").optional(),
    location: z2.string().optional(),
    imageUrl: z2.string().url("Invalid image URL").optional(),
    ticketPrice: z2.number().min(0, "Price must be non-negative").optional(),
    maxAttendees: z2.number().min(1, "Max attendees must be at least 1").optional(),
    active: z2.boolean().optional().default(true)
  }),
  workshop: z2.object({
    title: z2.string().min(2, "Title must be at least 2 characters"),
    description: z2.string().optional(),
    instructor: z2.string().min(2, "Instructor name required"),
    startDate: z2.string().datetime("Invalid start date"),
    endDate: z2.string().datetime("Invalid end date").optional(),
    duration: z2.number().min(1, "Duration must be at least 1 hour").optional(),
    location: z2.string().optional(),
    imageUrl: z2.string().url("Invalid image URL").optional(),
    price: z2.number().min(0, "Price must be non-negative"),
    maxParticipants: z2.number().min(1, "Max participants must be at least 1"),
    category: z2.string().optional(),
    materials: z2.array(z2.string()).optional(),
    active: z2.boolean().optional().default(true)
  }),
  artist: z2.object({
    name: z2.string().min(2, "Name must be at least 2 characters"),
    bio: z2.string().optional(),
    email: z2.string().email("Invalid email format").optional(),
    phone: z2.string().optional(),
    website: z2.string().url("Invalid website URL").optional(),
    profileImageUrl: z2.string().url("Invalid image URL").optional(),
    specialty: z2.array(z2.string()).optional(),
    featured: z2.boolean().optional().default(false),
    active: z2.boolean().optional().default(true)
  }),
  blog: z2.object({
    title: z2.string().min(2, "Title must be at least 2 characters"),
    content: z2.string().min(10, "Content must be at least 10 characters"),
    excerpt: z2.string().optional(),
    imageUrl: z2.string().url("Invalid image URL").optional(),
    tags: z2.array(z2.string()).optional(),
    published: z2.boolean().optional().default(false),
    publishedAt: z2.string().datetime("Invalid publish date").optional(),
    author: z2.string().optional()
  }),
  ticket: z2.object({
    eventId: z2.string().uuid("Invalid event ID").optional(),
    workshopId: z2.string().uuid("Invalid workshop ID").optional(),
    quantity: z2.number().min(1, "Quantity must be at least 1"),
    customerInfo: z2.object({
      name: z2.string().min(2, "Name must be at least 2 characters"),
      email: z2.string().email("Invalid email format"),
      phone: z2.string().optional()
    })
  })
};
var validateBody = /* @__PURE__ */ __name2((schema) => {
  return async (c, next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);
      c.set("validatedBody", validatedData);
      await next();
    } catch (error3) {
      if (error3 instanceof z2.ZodError) {
        return c.json({
          success: false,
          message: "Validation failed",
          errors: error3.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        }, 400);
      }
      return c.json({
        success: false,
        message: "Invalid JSON in request body"
      }, 400);
    }
  };
}, "validateBody");
var validateLogin = validateBody(schemas.login);
var validateRegister = validateBody(schemas.register);
var validateContact = validateBody(schemas.contact);
var validateGalleryItem = validateBody(schemas.galleryItem);
var validateEvent = validateBody(schemas.event);
var validateWorkshop = validateBody(schemas.workshop);
var validateArtist = validateBody(schemas.artist);
var validateBlog = validateBody(schemas.blog);
var validateTicket = validateBody(schemas.ticket);
var paginationSchema = z2.object({
  page: z2.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z2.string().regex(/^\d+$/).transform(Number).optional().default(10)
});
var searchSchema = paginationSchema.extend({
  search: z2.string().optional(),
  category: z2.string().optional(),
  tag: z2.string().optional(),
  featured: z2.string().regex(/^(true|false)$/).transform((val) => val === "true").optional(),
  active: z2.string().regex(/^(true|false)$/).transform((val) => val === "true").optional()
});
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var MemoryStore = class {
  static {
    __name(this, "MemoryStore");
  }
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  get(key) {
    return this.store.get(key);
  }
  set(key, value, ttl) {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl * 1e3
    });
    this.cleanup();
  }
  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (data.expiry < now) {
        this.store.delete(key);
      }
    }
  }
  exists(key) {
    const data = this.store.get(key);
    if (!data)
      return false;
    if (data.expiry < Date.now()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }
};
__name2(MemoryStore, "MemoryStore");
var store = new MemoryStore();
var rateLimiter = /* @__PURE__ */ __name2((options = {}) => {
  const {
    windowMs = 15 * 60 * 1e3,
    // 15 minutes
    max = 100,
    // limit each IP to 100 requests per windowMs
    message = "Too many requests from this IP, please try again later",
    statusCode = 429,
    keyGenerator = /* @__PURE__ */ __name2((c) => {
      return c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
    }, "keyGenerator")
  } = options;
  return async (c, next) => {
    try {
      const key = keyGenerator(c);
      const now = Date.now();
      const windowStart = now - windowMs;
      let rateLimitData = store.get(key);
      if (!rateLimitData || rateLimitData.expiry < now) {
        rateLimitData = {
          requests: [],
          expiry: now + windowMs
        };
      }
      rateLimitData.requests = rateLimitData.requests.filter(
        (timestamp) => timestamp > windowStart
      );
      if (rateLimitData.requests.length >= max) {
        const resetTime2 = Math.ceil((rateLimitData.requests[0] + windowMs) / 1e3);
        return c.json({
          success: false,
          message,
          rateLimitInfo: {
            limit: max,
            remaining: 0,
            resetTime: resetTime2,
            retryAfter: Math.ceil((rateLimitData.requests[0] + windowMs - now) / 1e3)
          }
        }, statusCode);
      }
      rateLimitData.requests.push(now);
      store.set(key, rateLimitData, Math.ceil(windowMs / 1e3));
      const remaining = Math.max(0, max - rateLimitData.requests.length);
      const resetTime = Math.ceil((rateLimitData.requests[0] + windowMs) / 1e3);
      c.res.headers.set("X-RateLimit-Limit", max.toString());
      c.res.headers.set("X-RateLimit-Remaining", remaining.toString());
      c.res.headers.set("X-RateLimit-Reset", resetTime.toString());
      await next();
    } catch (error3) {
      console.error("Rate limiter error:", error3);
      await next();
    }
  };
}, "rateLimiter");
var authRateLimiter = /* @__PURE__ */ __name2(() => rateLimiter({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  // limit each IP to 5 login attempts per 15 minutes
  message: "Too many authentication attempts, please try again later"
}), "authRateLimiter");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var catchAsync = /* @__PURE__ */ __name2((fn) => {
  return async (c, next) => {
    try {
      return await fn(c, next);
    } catch (error3) {
      console.error("Async error caught:", error3);
      return c.json({
        success: false,
        message: "Internal server error",
        error: error3.message
      }, 500);
    }
  };
}, "catchAsync");

// Helper function to create notifications for all users
var createNotificationForAllUsers = /* @__PURE__ */ __name2(async (db, type, title, message, link = null) => {
  try {
    const usersResult = await db.query('SELECT id FROM users WHERE is_active = true');
    const users = usersResult.data || [];
    
    const now = new Date().toISOString();
    for (const user of users) {
      await db.query(`
        INSERT INTO user_notifications (user_id, type, title, message, link, created_at, is_read)
        VALUES ($1, $2, $3, $4, $5, $6, false)
      `, [user.id, type, title, message, link, now]);
    }
    
    console.log(`Created ${type} notification for ${users.length} users`);
  } catch (error3) {
    console.error('Error creating notifications:', error3);
  }
}, "createNotificationForAllUsers");

// Helper function to delete notifications by type and title
var deleteNotificationsByTitle = /* @__PURE__ */ __name2(async (db, type, title) => {
  try {
    await db.query(`
      DELETE FROM user_notifications 
      WHERE type = $1 AND message LIKE $2
    `, [type, `%${title}%`]);
    console.log(`Deleted ${type} notifications containing title: ${title}`);
  } catch (error3) {
    console.error('Error deleting notifications:', error3);
  }
}, "deleteNotificationsByTitle");

var setupAuthRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.use("/auth/*", authRateLimiter());
  app2.post("/auth/login", validateLogin, catchAsync(async (c) => {
    const { email, password } = c.get("validatedBody");
    const db = createDatabase(c.env);
    try {
      const userResult = await db.query(
        "SELECT * FROM admin_users WHERE email = $1 AND active = true",
        [email]
      );
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const user = userResult.data[0];
      const storedPassword = user.password_hash || user.password;
      if (!storedPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const isValidPassword = await comparePassword(password, storedPassword);
      if (!isValidPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
        // 24 hours
      }, c.env?.JWT_SECRET);
      await db.query(
        "UPDATE admin_users SET last_login = $1 WHERE id = $2",
        [(/* @__PURE__ */ new Date()).toISOString(), user.id]
      );
      return c.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            permissions: user.permissions || [],
            last_login: (/* @__PURE__ */ new Date()).toISOString()
          }
        }
      });
    } catch (error3) {
      console.error("Login error:", error3);
      return c.json({
        success: false,
        message: "Login failed"
      }, 500);
    }
  }));
  app2.post("/auth/logout", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    const db = createDatabase(c.env);
    try {
      await db.query(
        "UPDATE admin_users SET last_logout = $1 WHERE id = $2",
        [(/* @__PURE__ */ new Date()).toISOString(), user.id]
      );
      return c.json({
        success: true,
        message: "Logout successful"
      });
    } catch (error3) {
      return c.json({
        success: true,
        message: "Logout successful"
      });
    }
  }));
  app2.get("/auth/verify", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    return c.json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          permissions: user.permissions || []
        }
      }
    });
  }));
  app2.get("/auth/me", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    const db = createDatabase(c.env);
    try {
      const result = await db.query(
        "SELECT id, email, name, role, avatar, created_at, last_login, permissions FROM admin_users WHERE id = $1",
        [user.id]
      );
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "User not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "User profile fetched successfully",
        data: {
          user: result.data[0]
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch user profile"
      }, 500);
    }
  }));
  app2.put("/auth/profile", authenticateToken, validateBody(z2.object({
    name: z2.string().min(2, "Name must be at least 2 characters").optional(),
    avatar: z2.string().url("Invalid avatar URL").optional(),
    current_password: z2.string().optional(),
    new_password: z2.string().min(8, "Password must be at least 8 characters").optional()
  })), catchAsync(async (c) => {
    const user = c.get("user");
    const { name, avatar, current_password, new_password } = c.get("validatedBody");
    const db = createDatabase(c.env);
    try {
      const updates = {};
      const params = [];
      let paramIndex = 1;
      if (name) {
        updates.name = `$${paramIndex++}`;
        params.push(name);
      }
      if (avatar) {
        updates.avatar = `$${paramIndex++}`;
        params.push(avatar);
      }
      if (new_password) {
        if (!current_password) {
          return c.json({
            success: false,
            message: "Current password is required to change password"
          }, 400);
        }
        const userResult = await db.query(
          "SELECT password_hash FROM admin_users WHERE id = $1",
          [user.id]
        );
        if (!userResult.success || userResult.data.length === 0) {
          return c.json({
            success: false,
            message: "User not found"
          }, 404);
        }
        const isValidPassword = await comparePassword(current_password, userResult.data[0].password_hash);
        if (!isValidPassword) {
          return c.json({
            success: false,
            message: "Current password is incorrect"
          }, 400);
        }
        const hashedPassword = await hashPassword(new_password);
        updates.password_hash = `$${paramIndex++}`;
        params.push(hashedPassword);
      }
      if (Object.keys(updates).length === 0) {
        return c.json({
          success: false,
          message: "No valid updates provided"
        }, 400);
      }
      updates.updated_at = `$${paramIndex++}`;
      params.push((/* @__PURE__ */ new Date()).toISOString());
      params.push(user.id);
      const setClause = Object.entries(updates).map(([key, placeholder]) => `${key} = ${placeholder}`).join(", ");
      const result = await db.query(
        `UPDATE admin_users SET ${setClause} WHERE id = $${paramIndex} RETURNING id, email, name, role, avatar`,
        params
      );
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Failed to update profile"
        }, 500);
      }
      return c.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: result.data[0]
        }
      });
    } catch (error3) {
      console.error("Profile update error:", error3);
      return c.json({
        success: false,
        message: "Failed to update profile"
      }, 500);
    }
  }));
  app2.post("/auth/change-password", authenticateToken, validateBody(z2.object({
    current_password: z2.string().min(1, "Current password is required"),
    new_password: z2.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z2.string().min(1, "Password confirmation is required")
  })), catchAsync(async (c) => {
    const user = c.get("user");
    const { current_password, new_password, confirm_password } = c.get("validatedBody");
    const db = createDatabase(c.env);
    if (new_password !== confirm_password) {
      return c.json({
        success: false,
        message: "New password and confirmation do not match"
      }, 400);
    }
    try {
      const userResult = await db.query(
        "SELECT password_hash FROM admin_users WHERE id = $1",
        [user.id]
      );
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          message: "User not found"
        }, 404);
      }
      const isValidPassword = await comparePassword(current_password, userResult.data[0].password_hash);
      if (!isValidPassword) {
        return c.json({
          success: false,
          message: "Current password is incorrect"
        }, 400);
      }
      const hashedPassword = await hashPassword(new_password);
      const updateResult = await db.query(
        "UPDATE admin_users SET password_hash = $1, updated_at = $2 WHERE id = $3",
        [hashedPassword, (/* @__PURE__ */ new Date()).toISOString(), user.id]
      );
      if (!updateResult.success) {
        return c.json({
          success: false,
          message: "Failed to update password"
        }, 500);
      }
      return c.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error3) {
      console.error("Password change error:", error3);
      return c.json({
        success: false,
        message: "Failed to change password"
      }, 500);
    }
  }));
  app2.post("/auth/refresh", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    try {
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
        // 24 hours
      }, c.env?.JWT_SECRET);
      return c.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to refresh token"
      }, 500);
    }
  }));
  app2.get("/auth/permissions", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    const db = createDatabase(c.env);
    try {
      const result = await db.query(
        "SELECT permissions FROM admin_users WHERE id = $1",
        [user.id]
      );
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "User not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Permissions fetched successfully",
        data: {
          permissions: result.data[0].permissions || []
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch permissions"
      }, 500);
    }
  }));
}, "setupAuthRoutes");

// User Authentication Routes (Public Users)
var setupUserAuthRoutes = /* @__PURE__ */ __name2((app2) => {
  // User Signup
  app2.post("/api/auth/signup", catchAsync(async (c) => {
    try {
      const { name, email, password, phone } = await c.req.json();
      
      if (!name || !email || !password) {
        return c.json({
          success: false,
          error: "Missing required fields: name, email, password"
        }, 400);
      }
      
      if (password.length < 8) {
        return c.json({
          success: false,
          error: "Password must be at least 8 characters"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Check if email exists
      const existingResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingResult.success && existingResult.data.length > 0) {
        return c.json({
          success: false,
          error: "Email already exists"
        }, 409);
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      const now = new Date().toISOString();
      
      // Create user with optional phone
      const insertResult = await db.query(`
        INSERT INTO users (name, email, password, phone, provider, last_login, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'email', $5, $6, $7)
        RETURNING *
      `, [name, email, hashedPassword, phone || null, now, now, now]);
      
      if (!insertResult.success || insertResult.data.length === 0) {
        throw new Error('Failed to create user');
      }
      
      const user = insertResult.data[0];
      
      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }, c.env?.JWT_SECRET);
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        },
        token
      }, 201);
    } catch (error3) {
      console.error('Signup error:', error3);
      return c.json({
        success: false,
        error: 'Failed to create account'
      }, 500);
    }
  }));
  
  // User Login
  app2.post("/api/auth/login", catchAsync(async (c) => {
    try {
      const { email, password } = await c.req.json();
      
      if (!email || !password) {
        return c.json({
          success: false,
          error: "Missing email or password"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Find user
      const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          error: "Invalid credentials"
        }, 401);
      }
      
      const user = userResult.data[0];
      
      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return c.json({
          success: false,
          error: "Invalid credentials"
        }, 401);
      }
      
      // Update last login
      const now = new Date().toISOString();
      await db.query('UPDATE users SET last_login = $1, updated_at = $2 WHERE id = $3', [now, now, user.id]);
      
      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }, c.env?.JWT_SECRET);
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: now
        },
        token
      });
    } catch (error3) {
      console.error('Login error:', error3);
      return c.json({
        success: false,
        error: 'Login failed'
      }, 500);
    }
  }));
  
  // Google OAuth
  app2.post("/api/auth/google", catchAsync(async (c) => {
    try {
      const { token: googleToken } = await c.req.json();
      
      if (!googleToken) {
        return c.json({
          success: false,
          error: "Missing Google token"
        }, 400);
      }
      
      // Verify Google token
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
      if (!response.ok) {
        return c.json({
          success: false,
          error: "Invalid Google token"
        }, 401);
      }
      
      const googleUser = await response.json();
      const email = googleUser.email;
      const name = googleUser.name;
      const photoUrl = googleUser.picture;
      const googleId = googleUser.sub;
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const now = new Date().toISOString();
      const existingUserResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = existingUserResult?.data?.[0] || null;
      
      if (user) {
        // Update existing user
        const updateResult = await db.query(`
          UPDATE users SET google_id = $1, photo_url = $2, last_login = $3, updated_at = $4 
          WHERE id = $5 RETURNING *
        `, [googleId, photoUrl, now, now, user.id]);
        user = updateResult?.data?.[0] || null;
      } else {
        // Create new user
        const insertResult = await db.query(`
          INSERT INTO users (name, email, provider, google_id, photo_url, last_login, created_at, updated_at)
          VALUES ($1, $2, 'google', $3, $4, $5, $6, $7) RETURNING *
        `, [name, email, googleId, photoUrl, now, now, now]);
        user = insertResult?.data?.[0] || null;
      }
      
      if (!user) {
        return c.json({
          success: false,
          error: "Failed to create or update user"
        }, 500);
      }
      
      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }, c.env?.JWT_SECRET);
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: now
        },
        token
      });
    } catch (error3) {
      console.error('Google auth error:', error3);
      return c.json({
        success: false,
        error: 'Google authentication failed'
      }, 500);
    }
  }));
  
  // Get Current User
  app2.get("/api/auth/me", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const userResult = await db.query('SELECT * FROM users WHERE id = $1', [tokenUser.userId]);
      const user = userResult?.data?.[0] || null;
      
      if (!user) {
        return c.json({
          success: false,
          error: "User not found"
        }, 404);
      }
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        }
      });
    } catch (error3) {
      console.error('Get user error:', error3);
      return c.json({
        success: false,
        error: 'Failed to get user data'
      }, 500);
    }
  }));
  
  // Update Profile
  app2.put("/api/auth/profile", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const { name, phone, bio, profile_image_url, old_profile_image_url } = await c.req.json();
      
      console.log('Profile update request:', {
        userId: tokenUser.userId,
        name,
        phone,
        bio,
        profile_image_url,
        old_profile_image_url
      });
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      // Delete old profile image from R2 if a new one is being uploaded
      if (old_profile_image_url && profile_image_url && old_profile_image_url !== profile_image_url) {
        try {
          const oldImageKey = old_profile_image_url.split('/').pop();
          const bucket = c.env.R2_BUCKET;
          if (bucket && oldImageKey) {
            await bucket.delete(`user-profiles/${oldImageKey}`);
            console.log('Old profile image deleted:', oldImageKey);
          }
        } catch (deleteError) {
          console.error('Failed to delete old profile image:', deleteError);
          // Continue with update even if delete fails
        }
      }
      
      const now = new Date().toISOString();
      const updateResult = await db.query(`
        UPDATE users SET name = $1, phone = $2, bio = $3, profile_image_url = $4, updated_at = $5 
        WHERE id = $6 RETURNING *
      `, [name || null, phone || null, bio || null, profile_image_url || null, now, tokenUser.userId]);
      
      console.log('Update result:', {
        success: updateResult?.success,
        rowCount: updateResult?.data?.length,
        error: updateResult?.error
      });
      
      const user = updateResult?.data?.[0] || null;
      
      if (!user) {
        console.error('No user returned after update');
        return c.json({
          success: false,
          error: "Failed to update profile - user not found or no changes made"
        }, 500);
      }
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        }
      });
    } catch (error3) {
      console.error('Update profile error:', error3);
      return c.json({
        success: false,
        error: error3.message || 'Failed to update profile'
      }, 500);
    }
  }));
  
  // Get User Notifications
  app2.get("/api/auth/notifications", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const result = await db.query(`
        SELECT * FROM user_notifications 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 50
      `, [tokenUser.userId]);
      
      return c.json({
        success: true,
        data: result.data || []
      });
    } catch (error3) {
      console.error('Get notifications error:', error3);
      return c.json({
        success: false,
        error: 'Failed to fetch notifications'
      }, 500);
    }
  }));
  
  // Mark Notification as Read
  app2.put("/api/auth/notifications/:id/read", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const notificationId = c.req.param("id");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      await db.query(`
        UPDATE user_notifications 
        SET is_read = true, read_at = $1 
        WHERE id = $2 AND user_id = $3
      `, [new Date().toISOString(), notificationId, tokenUser.userId]);
      
      return c.json({
        success: true,
        message: "Notification marked as read"
      });
    } catch (error3) {
      console.error('Mark notification read error:', error3);
      return c.json({
        success: false,
        error: 'Failed to mark notification as read'
      }, 500);
    }
  }));
  
  // Mark All Notifications as Read
  app2.put("/api/auth/notifications/read-all", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      await db.query(`
        UPDATE user_notifications 
        SET is_read = true, read_at = $1 
        WHERE user_id = $2 AND is_read = false
      `, [new Date().toISOString(), tokenUser.userId]);
      
      return c.json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error3) {
      console.error('Mark all notifications read error:', error3);
      return c.json({
        success: false,
        error: 'Failed to mark notifications as read'
      }, 500);
    }
  }));

  // Delete All Notifications for User
  app2.delete("/api/auth/notifications/delete-all", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      await db.query(`
        DELETE FROM user_notifications 
        WHERE user_id = $1
      `, [tokenUser.userId]);
      
      return c.json({
        success: true,
        message: "All notifications deleted"
      });
    } catch (error3) {
      console.error('Delete all notifications error:', error3);
      return c.json({
        success: false,
        error: 'Failed to delete notifications'
      }, 500);
    }
  }));
  
  // Admin: Get All Users
  app2.get("/api/admin/users", authenticateAdminOrUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const adminEmails = ['admin@kalakritam.in', 'gowtham@kalakritam.in'];
      const envAdmins = c.env?.ADMIN_EMAILS?.split(',') || [];
      const allAdmins = [...adminEmails, ...envAdmins];
      
      if (!allAdmins.includes(tokenUser.email?.toLowerCase())) {
        return c.json({
          success: false,
          error: "Unauthorized. Admin access required."
        }, 403);
      }
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      const users = (result?.data || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        googleId: user.google_id,
        photoUrl: user.photo_url,
        phone: user.phone,
        bio: user.bio,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login
      }));
      
      // Calculate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(user => 
          user.lastLogin && new Date(user.lastLogin) > thirtyDaysAgo
        ).length,
        googleUsers: users.filter(user => user.provider === 'google').length,
        emailUsers: users.filter(user => user.provider === 'email').length
      };
      
      return c.json({
        success: true,
        data: users,
        stats
      });
    } catch (error3) {
      console.error('Get all users error:', error3);
      return c.json({
        success: false,
        error: 'Failed to get users'
      }, 500);
    }
  }));
  
  // Admin: Delete User
  app2.delete("/api/admin/users/:id", authenticateAdminOrUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const adminEmails = ['admin@kalakritam.in', 'gowtham@kalakritam.in'];
      const envAdmins = c.env?.ADMIN_EMAILS?.split(',') || [];
      const allAdmins = [...adminEmails, ...envAdmins];
      
      if (!allAdmins.includes(tokenUser.email?.toLowerCase())) {
        return c.json({
          success: false,
          error: "Unauthorized. Admin access required."
        }, 403);
      }
      
      const userId = parseInt(c.req.param("id"));
      
      if (tokenUser.userId === userId) {
        return c.json({
          success: false,
          error: "Cannot delete your own account"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
      
      if (!result?.success || !result?.data || result.data.length === 0) {
        return c.json({
          success: false,
          error: "User not found"
        }, 404);
      }
      
      return c.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error3) {
      console.error('Delete user error:', error3);
      return c.json({
        success: false,
        error: 'Failed to delete user'
      }, 500);
    }
  }));
}, "setupUserAuthRoutes");

init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupGalleryRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/gallery", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const category = c.req.query("category");
      const search = c.req.query("search");
      const isAuthenticated = c.get("isAuthenticated");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
  let whereClause = "WHERE COALESCE(available, true) = true";
      let params = [];
      let paramIndex = 1;
      if (category) {
        whereClause += ` AND category = $${paramIndex++}`;
        params.push(category);
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM artworks ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, description, image_url, thumbnail_url, artist, 
               category, medium, dimensions, year, price, 
               available, slug, created_at, updated_at
        FROM artworks 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const artworks = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Gallery items fetched successfully",
        data: artworks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch gallery items",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/gallery/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const isAuthenticated = c.get("isAuthenticated");
      const db = createDatabase(c.env);
      const query = `
        SELECT id, title, description, image_url, thumbnail_url, artist, 
               category, medium, dimensions, year, price, 
               available, slug, meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM artworks 
        WHERE id = $1 AND available = true
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Gallery item not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Gallery item fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch gallery item",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/gallery", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Gallery item created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create gallery item",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/gallery/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Gallery item updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update gallery item",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/gallery/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Gallery item deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete gallery item",
        error: error3.message
      }, 500);
    }
  }));
}, "setupGalleryRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupEventsRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/events", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const upcoming = c.req.query("upcoming") === "true";
      const search = c.req.query("search");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
  let whereClause = "WHERE COALESCE(active, true) = true";
      let params = [];
      let paramIndex = 1;
      if (upcoming) {
        whereClause += ` AND start_date > NOW()`;
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, description, category, start_date, end_date, venue, 
               ticket_price, max_attendees, current_attendees, image_url, video_url, 
               district_url, book_my_show_url, featured, active, slug, created_at, updated_at
        FROM events 
        ${whereClause}
        ORDER BY featured DESC, start_date ASC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const events = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Events fetched successfully",
        data: events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch events",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/events/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      const query = `
        SELECT id, title, description, start_date, end_date, venue, 
               ticket_price, max_attendees, current_attendees, image_url, 
               featured, active, slug, meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM events 
        WHERE id = $1 AND active = true
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Event not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Event fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch event",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/events", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Event created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create event",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/events/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Event updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update event",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/events/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Event deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete event",
        error: error3.message
      }, 500);
    }
  }));
}, "setupEventsRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupWorkshopsRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/workshops", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const search = c.req.query("search");
      const upcoming = c.req.query("upcoming") === "true";
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereClause = "WHERE active = true";
      let params = [];
      let paramIndex = 1;
      if (upcoming) {
        whereClause += ` AND start_date > NOW()`;
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM workshops ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, description, instructor, start_date, end_date, 
               venue, duration, price, max_participants, current_participants, 
               image_url, active, slug, created_at, updated_at
        FROM workshops 
        ${whereClause}
        ORDER BY start_date ASC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const workshops = result.success ? result.data.map(w => ({
        ...w,
        startDate: w.start_date,
        endDate: w.end_date,
        imageUrl: w.image_url,
        maxParticipants: w.max_participants,
        currentParticipants: w.current_participants,
        createdAt: w.created_at,
        updatedAt: w.updated_at
      })) : [];
      return c.json({
        success: true,
        message: "Workshops fetched successfully",
        data: workshops,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch workshops",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/workshops/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      
      // Check if id is a UUID or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      const query = `
        SELECT id, title, description, instructor, start_date, end_date, 
               venue, duration, price, max_participants, current_participants, 
               image_url, active, slug, meta_title, meta_description, 
               meta_keywords, og_title, og_description, og_image, created_at, updated_at
        FROM workshops 
        WHERE ${isUUID ? 'id' : 'slug'} = $1 AND active = true
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Workshop not found"
        }, 404);
      }
      const workshop = result.data[0];
      const transformedWorkshop = {
        ...workshop,
        startDate: workshop.start_date,
        endDate: workshop.end_date,
        imageUrl: workshop.image_url,
        maxParticipants: workshop.max_participants,
        currentParticipants: workshop.current_participants,
        metaTitle: workshop.meta_title,
        metaDescription: workshop.meta_description,
        metaKeywords: workshop.meta_keywords,
        ogTitle: workshop.og_title,
        ogDescription: workshop.og_description,
        ogImage: workshop.og_image,
        createdAt: workshop.created_at,
        updatedAt: workshop.updated_at
      };
      return c.json({
        success: true,
        message: "Workshop fetched successfully",
        data: transformedWorkshop
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch workshop",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/workshops", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Workshop created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create workshop",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/workshops/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Workshop updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update workshop",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/workshops/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Workshop deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete workshop",
        error: error3.message
      }, 500);
    }
  }));
}, "setupWorkshopsRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupArtistsRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/artists", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const featured = c.req.query("featured") === "true";
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereConditions = ["active = true"];
      if (featured) {
        whereConditions.push("featured = true");
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM artists ${whereClause}`;
      const countResult = await db.query(countQuery);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      const query = `
        SELECT 
          id, name, bio, specialization, email, phone, website, 
          image_url, social_links, featured, active,
          meta_title, meta_description, meta_keywords, slug,
          og_title, og_description, og_image,
          created_at, updated_at
        FROM artists 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      return c.json({
        success: true,
        message: "Artists fetched successfully",
        data: result.data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error3) {
      console.error("Error fetching artists:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch artists",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/artists/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      const query = `
        SELECT 
          id, name, bio, specialization, email, phone, website, 
          image_url, social_links, featured, active,
          meta_title, meta_description, meta_keywords, slug,
          og_title, og_description, og_image,
          created_at, updated_at
        FROM artists 
        WHERE id = $1 AND active = true
      `;
      const result = await db.query(query, [id]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Artist not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Artist fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error fetching artist:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch artist",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/artists", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Artist created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create artist",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/artists/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Artist updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update artist",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/artists/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Artist deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete artist",
        error: error3.message
      }, 500);
    }
  }));
}, "setupArtistsRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupBlogsRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/blogs", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 10;
      const category = c.req.query("category");
      const search = c.req.query("search");
      const isAuthenticated = c.get("isAuthenticated");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereClause = isAuthenticated ? "WHERE TRUE" : "WHERE published = true";
      let params = [];
      let paramIndex = 1;
      if (category) {
        whereClause += ` AND category = $${paramIndex++}`;
        params.push(category);
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR content ILIKE $${paramIndex++} OR excerpt ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM blogs ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, content, excerpt, author, category, tags, 
               image_url, published, featured, read_time, slug, 
               created_at, updated_at
        FROM blogs 
        ${whereClause}
        ORDER BY featured DESC, created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const blogs = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch blogs",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/blogs/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const isAuthenticated = c.get("isAuthenticated");
      const db = createDatabase(c.env);
      const whereClause = isAuthenticated ? "AND TRUE" : "AND published = true";
      const query = `
        SELECT id, title, content, excerpt, author, category, tags, 
               image_url, published, featured, read_time, slug, 
               meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM blogs 
        WHERE id = $1 ${whereClause}
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Blog not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Blog fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch blog",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/blogs", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Blog created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create blog",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/blogs/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Blog updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update blog",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/blogs/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Blog deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete blog",
        error: error3.message
      }, 500);
    }
  }));
}, "setupBlogsRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupContactRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.post("/contact", catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { name, email, message, phone, subject } = body;
      if (!name || !email || !message) {
        return c.json({
          success: false,
          message: "Name, email, and message are required"
        }, 400);
      }
      const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex2.test(email)) {
        return c.json({
          success: false,
          message: "Please provide a valid email address"
        }, 400);
      }
      const db = createDatabase(c.env);
      const id = `rec_${Math.random().toString(36).substr(2, 24)}`;
      const query = `
        INSERT INTO contacts (
          id, name, email, phone, subject, message, 
          status, is_read, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const result = await db.query(query, [
        id,
        name,
        email,
        phone || null,
        subject || "General Inquiry",
        message,
        "unread",
        false,
        now,
        now
      ]);
      return c.json({
        success: true,
        message: "Contact form submitted successfully. We will get back to you soon!",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error submitting contact form:", error3);
      return c.json({
        success: false,
        message: "Failed to submit contact form",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/contact/info", catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "Contact information retrieved successfully",
        data: {
          email: "info@kalakritam.in",
          phone: "+91-XXXXXXXXXX",
          address: "Kalakritam Art Gallery, City, State",
          hours: "Mon-Sat: 10AM-6PM"
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to get contact info",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/admin/contacts", authenticateToken, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 20;
      const status = c.req.query("status");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (status) {
        whereConditions.push(`status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      params.push(limit, offset);
      const query = `
        SELECT 
          id, name, email, phone, subject, message, 
          status, is_read, created_at, updated_at
        FROM contacts 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const result = await db.query(query, params);
      return c.json({
        success: true,
        message: "Contacts fetched successfully",
        data: result.data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error3) {
      console.error("Error fetching contacts:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch contacts",
        error: error3.message
      }, 500);
    }
  }));
  app2.patch("/admin/contacts/:id/read", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      const query = `
        UPDATE contacts 
        SET is_read = true, status = 'read', updated_at = $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await db.query(query, [(/* @__PURE__ */ new Date()).toISOString(), id]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Contact not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Contact marked as read",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error marking contact as read:", error3);
      return c.json({
        success: false,
        message: "Failed to mark contact as read",
        error: error3.message
      }, 500);
    }
  }));
}, "setupContactRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupTicketsRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/tickets", optionalAuth, catchAsync(async (c) => {
    try {
      const eventId = c.req.query("eventId");
      const workshopId = c.req.query("workshopId");
      const status = c.req.query("status");
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 20;
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (eventId) {
        whereConditions.push(`event_id = $${paramIndex}`);
        params.push(eventId);
        paramIndex++;
      }
      if (status) {
        whereConditions.push(`status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM tickets ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      params.push(limit, offset);
      const query = `
        SELECT 
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, event_timings, venue,
          qr_code_url, status, is_verified, verified_at, verified_by, created_at, updated_at
        FROM tickets 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const result = await db.query(query, params);
      return c.json({
        success: true,
        message: "Tickets fetched successfully",
        data: result.data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: { eventId, workshopId, status }
      });
    } catch (error3) {
      console.error("Error fetching tickets:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch tickets",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/tickets/purchase", catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { eventId, workshopId, quantity, customerInfo } = body;
      if (!customerInfo || !customerInfo.name || !customerInfo.email) {
        return c.json({
          success: false,
          message: "Customer name and email are required"
        }, 400);
      }
      if (!eventId && !workshopId) {
        return c.json({
          success: false,
          message: "Event ID or Workshop ID is required"
        }, 400);
      }
      if (!quantity || quantity < 1) {
        return c.json({
          success: false,
          message: "Valid quantity is required"
        }, 400);
      }
      return c.json({
        success: true,
        message: "Ticket purchase functionality not implemented yet",
        data: { eventId, workshopId, quantity, customerInfo }
      });
    } catch (error3) {
      console.error("Error purchasing ticket:", error3);
      return c.json({
        success: false,
        message: "Failed to purchase ticket",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/tickets/verify/:ticketId", catchAsync(async (c) => {
    try {
      const ticketId = c.req.param("ticketId");
      const db = createDatabase(c.env);
      const query = `
        SELECT 
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, event_timings, venue,
          qr_code_url, url, status, is_verified, verified_at, verified_by, created_at
        FROM tickets 
        WHERE id = $1 OR ticket_number = $1
      `;
      const result = await db.query(query, [ticketId]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
      const ticket = result.data[0];
      if (ticket.status !== "valid") {
        return c.json({
          success: false,
          message: `Ticket is ${ticket.status}`,
          data: { status: ticket.status }
        }, 400);
      }
      return c.json({
        success: true,
        message: "Ticket verified successfully",
        data: ticket
      });
    } catch (error3) {
      console.error("Error verifying ticket:", error3);
      return c.json({
        success: false,
        message: "Failed to verify ticket",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/tickets/:ticketId", catchAsync(async (c) => {
    try {
      const ticketId = c.req.param("ticketId");
      const db = createDatabase(c.env);
      const query = `
        SELECT 
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, event_timings, venue,
          qr_code, qr_code_url, status, is_verified, verified_at, verified_by, created_at, updated_at
        FROM tickets 
        WHERE id = $1 OR ticket_number = $1
      `;
      const result = await db.query(query, [ticketId]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Ticket details fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error fetching ticket details:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch ticket details",
        error: error3.message
      }, 500);
    }
  }));
  app2.patch("/tickets/:ticketId/verify", authenticateToken, catchAsync(async (c) => {
    try {
      const ticketId = c.req.param("ticketId");
      const user = c.get("user");
      const db = createDatabase(c.env);
      const query = `
        UPDATE tickets 
        SET is_verified = true, verified_at = $1, verified_by = $2, updated_at = $1
        WHERE id = $3 OR ticket_number = $3
        RETURNING *
      `;
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const result = await db.query(query, [now, user.email, ticketId]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Ticket marked as verified",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error marking ticket as verified:", error3);
      return c.json({
        success: false,
        message: "Failed to mark ticket as verified",
        error: error3.message
      }, 500);
    }
  }));
}, "setupTicketsRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_database_workers();
init_auth_workers();
var setupAdminRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.post("/admin/login", catchAsync(async (c) => {
    const { email, password } = await c.req.json();
    const db = createDatabase(c.env);
    try {
      const userResult = await db.query(
        "SELECT * FROM admin_users WHERE email = $1 AND active = true",
        [email]
      );
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const user = userResult.data[0];
      const storedPassword = user.password;
      if (!storedPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const isValidPassword = await comparePassword(password, storedPassword);
      if (!isValidPassword && password === storedPassword) {
      } else if (!isValidPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      await db.query(
        "UPDATE admin_users SET last_login = NOW() WHERE id = $1",
        [user.id]
      );
      const tokenPayload = {
        userId: user.id,
        // Note: use userId to match middleware expectation
        id: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
        // 24 hours
      };
      const token = await generateToken(tokenPayload, c.env.JWT_SECRET);
      return c.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error3) {
      console.error("Login error:", error3);
      return c.json({
        success: false,
        message: "Login failed"
      }, 500);
    }
  }));
  app2.get("/admin/me", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({
        success: false,
        message: "User not found"
      }, 401);
    }
    return c.json({
      success: true,
      user: {
        id: user.id || user.userId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  }));
  app2.get("/admin/tickets", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search, status, event_id } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (status) {
        whereConditions.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      if (event_id) {
        whereConditions.push(`event_id = $${paramIndex++}`);
        params.push(event_id);
      }
      if (search) {
        whereConditions.push(`(customer_name ILIKE $${paramIndex++} OR customer_email ILIKE $${paramIndex++} OR ticket_number ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM tickets ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, ticket_number, customer_name, customer_email, customer_phone,
               event_name, event_id, number_of_tickets, amount_paid, 
               event_timings, venue, qr_code_url, url, status, is_verified, 
               verified_at, verified_by, created_at, updated_at
        FROM tickets 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const tickets = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Tickets fetched successfully",
        data: tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch tickets",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/tickets", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const ticketData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const ticketNumber = ticketData.ticket_number || `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const query = `
        INSERT INTO tickets (
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, 
          event_timings, venue, qr_code_url, url, status, is_verified, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        ticketNumber,
        ticketData.customer_name,
        ticketData.customer_email,
        ticketData.customer_phone || null,
        ticketData.event_name || null,
        ticketData.event_id || null,
        ticketData.number_of_tickets || 1,
        ticketData.amount_paid || null,
        ticketData.event_timings || null,
        ticketData.venue || null,
        ticketData.qr_code_url || null,
        ticketData.url || null,
        ticketData.status || "valid",
        ticketData.is_verified || false,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create ticket",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/tickets/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const ticketData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        UPDATE tickets SET
          customer_name = $2, customer_email = $3, customer_phone = $4,
          event_name = $5, event_id = $6, number_of_tickets = $7,
          amount_paid = $8, event_timings = $9, venue = $10, 
          qr_code_url = $11, url = $12, status = $13, is_verified = $14, updated_at = $15
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        ticketData.customer_name,
        ticketData.customer_email,
        ticketData.customer_phone || null,
        ticketData.event_name || null,
        ticketData.event_id || null,
        ticketData.number_of_tickets || 1,
        ticketData.amount_paid || null,
        ticketData.event_timings || null,
        ticketData.venue || null,
        ticketData.qr_code_url || null,
        ticketData.url || null,
        ticketData.status || "valid",
        ticketData.is_verified || false,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update ticket or ticket not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update ticket",
        error: error3.message
      }, 500);
    }
  }));
  app2.patch("/admin/tickets/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const updates = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const updateFields = [];
      const params = [id];
      let paramIndex = 2;
      if (updates.url !== void 0) {
        updateFields.push(`url = $${paramIndex++}`);
        params.push(updates.url);
      }
      if (updates.customer_name !== void 0) {
        updateFields.push(`customer_name = $${paramIndex++}`);
        params.push(updates.customer_name);
      }
      if (updates.customer_email !== void 0) {
        updateFields.push(`customer_email = $${paramIndex++}`);
        params.push(updates.customer_email);
      }
      if (updates.customer_phone !== void 0) {
        updateFields.push(`customer_phone = $${paramIndex++}`);
        params.push(updates.customer_phone);
      }
      if (updates.event_name !== void 0) {
        updateFields.push(`event_name = $${paramIndex++}`);
        params.push(updates.event_name);
      }
      if (updates.venue !== void 0) {
        updateFields.push(`venue = $${paramIndex++}`);
        params.push(updates.venue);
      }
      if (updates.amount_paid !== void 0) {
        updateFields.push(`amount_paid = $${paramIndex++}`);
        params.push(updates.amount_paid);
      }
      if (updates.status !== void 0) {
        updateFields.push(`status = $${paramIndex++}`);
        params.push(updates.status);
      }
      updateFields.push(`updated_at = $${paramIndex++}`);
      params.push(now);
      if (updateFields.length === 1) {
        return c.json({
          success: false,
          message: "No fields to update"
        }, 400);
      }
      const query = `
        UPDATE tickets SET ${updateFields.join(", ")}
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, params);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update ticket or ticket not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update ticket",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/tickets/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM tickets WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete ticket",
        error: error3.message
      }, 500);
    }
  }));
  app2.use("/admin/*", authenticateToken);
  // Financial Analytics: Event Financials CRUD and Analytics
  // List financials with joined event details
  app2.get("/admin/financials", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { event_id = null, page = 1, limit = 100, year = null, month = null } = c.req.query();
    const filters = [];
    const params = [];
    let idx = 1;
    if (event_id) {
      filters.push(`ef.event_id = $${idx++}`);
      params.push(event_id);
    }
    if (year) {
      filters.push(`EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at)) = $${idx++}`);
      params.push(parseInt(year));
    }
    if (month) {
      filters.push(`EXTRACT(MONTH FROM COALESCE(e.start_date, ef.created_at)) = $${idx++}`);
      params.push(parseInt(month));
    }
    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const query = `
      SELECT 
        ef.id,
        ef.event_id,
        e.title AS event_name,
        e.start_date AS event_date,
        COALESCE(ef.ticket_sold, 0) AS ticket_sold,
        COALESCE(ef.income, 0) AS income,
        COALESCE(ef.event_expense, 0) AS event_expense,
        COALESCE(ef.material_cost, 0) AS material_cost,
        COALESCE(ef.marketing_cost, 0) AS marketing_cost,
        (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)) AS total_investment,
        (COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0))) AS total_profit,
        ef.created_at,
        ef.updated_at
      FROM event_financials ef
      LEFT JOIN events e ON e.id::text = ef.event_id::text
      ${whereClause}
      ORDER BY COALESCE(e.start_date, ef.created_at) DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM event_financials ef 
      LEFT JOIN events e ON e.id::text = ef.event_id::text
      ${whereClause}
    `;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [dataRes, countRes] = await Promise.all([
      db.query(query, [...params, parseInt(limit), offset]),
      db.query(countQuery, params)
    ]);
    if (!dataRes.success || !countRes.success) {
      const err = dataRes.success ? countRes.error : dataRes.error;
      return c.json({ success: false, message: "Failed to fetch financials", error: err }, 500);
    }
    const total = parseInt(countRes.data[0].total || 0);
    const totalPages = Math.ceil(total / parseInt(limit || 1));
    return c.json({
      success: true,
      message: "Financials fetched successfully",
      data: dataRes.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  }));
  // Create financial record
  app2.post("/admin/financials", validateBody(z2.object({
    event_id: z2.union([z2.string(), z2.number()]),
    ticket_sold: z2.number().int().nonnegative().optional(),
    income: z2.number().nonnegative(),
    event_expense: z2.number().nonnegative().optional(),
    material_cost: z2.number().nonnegative().optional(),
    marketing_cost: z2.number().nonnegative().optional()
  })), catchAsync(async (c) => {
    const body = c.get("validatedBody");
    const db = createDatabase(c.env);
    const payload = {
      event_id: body.event_id,
      ticket_sold: body.ticket_sold ?? 0,
      income: body.income ?? 0,
      event_expense: body.event_expense ?? 0,
      material_cost: body.material_cost ?? 0,
      marketing_cost: body.marketing_cost ?? 0,
      created_at: (new Date()).toISOString(),
      updated_at: (new Date()).toISOString()
    };
    const result = await db.insert("event_financials", payload);
    if (!result.success) {
      return c.json({ success: false, message: "Failed to create financial record", error: result.error }, 500);
    }
    return c.json({ success: true, message: "Financial record created", data: result.data }, 201);
  }));
  // Update financial record
  app2.put("/admin/financials/:id", validateBody(z2.object({
    event_id: z2.union([z2.string(), z2.number()]).optional(),
    ticket_sold: z2.number().int().nonnegative().optional(),
    income: z2.number().nonnegative().optional(),
    event_expense: z2.number().nonnegative().optional(),
    material_cost: z2.number().nonnegative().optional(),
    marketing_cost: z2.number().nonnegative().optional()
  })), catchAsync(async (c) => {
    const id = c.req.param("id");
    const updates = c.get("validatedBody");
    const db = createDatabase(c.env);
    const result = await db.update("event_financials", id, { ...updates });
    if (!result.success) {
      return c.json({ success: false, message: "Failed to update financial record", error: result.error }, 500);
    }
    return c.json({ success: true, message: "Financial record updated", data: result.data });
  }));
  // Delete financial record
  app2.delete("/admin/financials/:id", catchAsync(async (c) => {
    const id = c.req.param("id");
    const db = createDatabase(c.env);
    const res = await db.query("DELETE FROM event_financials WHERE id = $1 RETURNING id", [id]);
    if (!res.success) {
      return c.json({ success: false, message: "Failed to delete financial record", error: res.error }, 500);
    }
    if (res.data.length === 0) {
      return c.json({ success: false, message: "Financial record not found" }, 404);
    }
    return c.json({ success: true, message: "Financial record deleted" });
  }));
  // Monthly summary for a given year
  app2.get("/admin/financials/summary/monthly", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { year } = c.req.query();
    const y = parseInt(year || new Date().getFullYear());
    const query = `
      SELECT 
        EXTRACT(MONTH FROM COALESCE(e.start_date, ef.created_at))::int AS month,
        SUM(COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)))::numeric AS total_profit
      FROM event_financials ef
      LEFT JOIN events e ON e.id = ef.event_id
      WHERE EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at)) = $1
      GROUP BY month
      ORDER BY month`;
    const res = await db.query(query, [y]);
    if (!res.success) return c.json({ success: false, message: "Failed to fetch monthly summary", error: res.error }, 500);
    return c.json({ success: true, data: res.data, year: y });
  }));
  // Yearly summary (all years)
  app2.get("/admin/financials/summary/yearly", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const query = `
      SELECT 
        EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at))::int AS year,
        SUM(COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)))::numeric AS total_profit
      FROM event_financials ef
      LEFT JOIN events e ON e.id = ef.event_id
      GROUP BY year
      ORDER BY year`;
    const res = await db.query(query);
    if (!res.success) return c.json({ success: false, message: "Failed to fetch yearly summary", error: res.error }, 500);
    return c.json({ success: true, data: res.data });
  }));
  // Analytics dataset for charts
  app2.get("/admin/financials/analytics", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const [eventsRes, monthlyRes, ticketRes] = await Promise.all([
      db.query(`
        SELECT 
          ef.id,
          ef.event_id,
          e.title AS event_name,
          e.start_date AS event_date,
          COALESCE(ef.income,0) AS income,
          (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)) AS total_investment,
          (COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0))) AS total_profit
        FROM event_financials ef
        LEFT JOIN events e ON e.id = ef.event_id
        ORDER BY COALESCE(e.start_date, ef.created_at) ASC
      `),
      db.query(`
        SELECT 
          DATE_TRUNC('month', COALESCE(e.start_date, ef.created_at)) AS month,
          SUM(COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)))::numeric AS total_profit
        FROM event_financials ef
        LEFT JOIN events e ON e.id = ef.event_id
        GROUP BY month
        ORDER BY month
      `),
      db.query(`
        SELECT 
          ef.event_id,
          e.title AS event_name,
          COALESCE(ef.ticket_sold,0) AS ticket_sold
        FROM event_financials ef
        LEFT JOIN events e ON e.id = ef.event_id
        ORDER BY ticket_sold DESC
      `)
    ]);
    if (!eventsRes.success || !monthlyRes.success || !ticketRes.success) {
      return c.json({ success: false, message: "Failed to fetch analytics", error: (eventsRes.error || monthlyRes.error || ticketRes.error) }, 500);
    }
    const eventProfits = eventsRes.data.map(r => ({
      eventId: r.event_id,
      eventName: r.event_name,
      eventDate: r.event_date,
      profit: Number(r.total_profit),
      income: Number(r.income),
      investment: Number(r.total_investment)
    }));
    const monthlyTrend = monthlyRes.data.map(r => ({
      month: r.month,
      totalProfit: Number(r.total_profit)
    }));
    const ticketDistribution = ticketRes.data.map(r => ({
      eventId: r.event_id,
      eventName: r.event_name,
      tickets: Number(r.ticket_sold)
    }));
    return c.json({
      success: true,
      data: { eventProfits, monthlyTrend, ticketDistribution }
    });
  }));
  app2.get("/admin/dashboard", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      const [
        galleryCount,
        eventsCount,
        workshopsCount,
        artistsCount,
        blogsCount,
        contactSubmissions,
        ticketsSold,
        recentActivity
      ] = await Promise.all([
        db.query("SELECT COUNT(*) as count FROM gallery_items WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM events WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM workshops WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM artists WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM blogs WHERE published = true"),
        db.query("SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= NOW() - INTERVAL '30 days'"),
        db.query("SELECT COUNT(*) as count FROM tickets WHERE created_at >= NOW() - INTERVAL '30 days'"),
        db.query(`
          SELECT 'gallery' as type, title as name, created_at FROM gallery_items WHERE created_at >= NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT 'event' as type, title as name, created_at FROM events WHERE created_at >= NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT 'workshop' as type, title as name, created_at FROM workshops WHERE created_at >= NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT 'blog' as type, title as name, created_at FROM blogs WHERE created_at >= NOW() - INTERVAL '7 days'
          ORDER BY created_at DESC LIMIT 10
        `)
      ]);
      const revenueResult = await db.query(`
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as revenue,
          COUNT(*) as transactions
        FROM tickets 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);
      return c.json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
          overview: {
            gallery_items: galleryCount.success ? galleryCount.data[0].count : 0,
            events: eventsCount.success ? eventsCount.data[0].count : 0,
            workshops: workshopsCount.success ? workshopsCount.data[0].count : 0,
            artists: artistsCount.success ? artistsCount.data[0].count : 0,
            published_blogs: blogsCount.success ? blogsCount.data[0].count : 0,
            recent_contacts: contactSubmissions.success ? contactSubmissions.data[0].count : 0,
            recent_tickets: ticketsSold.success ? ticketsSold.data[0].count : 0
          },
          recent_activity: recentActivity.success ? recentActivity.data : [],
          revenue_chart: revenueResult.success ? revenueResult.data : []
        }
      });
    } catch (error3) {
      console.error("Dashboard error:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch dashboard data"
      }, 500);
    }
  }));
  app2.get("/admin/settings", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      const result = await db.query("SELECT key, value, description FROM system_settings ORDER BY key");
      const settings = {};
      if (result.success) {
        result.data.forEach((row) => {
          settings[row.key] = {
            value: JSON.parse(row.value),
            description: row.description
          };
        });
      }
      return c.json({
        success: true,
        message: "Settings fetched successfully",
        data: { settings }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch settings"
      }, 500);
    }
  }));
  app2.put("/admin/settings", validateBody(z2.object({
    settings: z2.record(z2.any())
  })), catchAsync(async (c) => {
    const { settings } = c.get("validatedBody");
    const db = createDatabase(c.env);
    const user = c.get("user");
    try {
      const updates = [];
      for (const [key, value] of Object.entries(settings)) {
        updates.push({
          query: `
            INSERT INTO system_settings (key, value, updated_by, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (key) 
            DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()
          `,
          params: [key, JSON.stringify(value), user.id]
        });
      }
      const result = await db.transaction(updates);
      if (!result.success) {
        return c.json({
          success: false,
          message: "Failed to update settings"
        }, 500);
      }
      return c.json({
        success: true,
        message: "Settings updated successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update settings"
      }, 500);
    }
  }));
  app2.get("/admin/users", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search = "" } = c.req.query();
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        searchFields: ["name", "email"],
        orderBy: "created_at DESC"
      };
      const result = await db.list("admin_users", options);
      if (!result.success) {
        return c.json({
          success: false,
          message: "Failed to fetch users"
        }, 500);
      }
      const users = result.data.map((user) => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return c.json({
        success: true,
        message: "Users fetched successfully",
        data: users,
        pagination: result.pagination
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch users"
      }, 500);
    }
  }));
  app2.post("/admin/users", requireAdmin, validateBody(z2.object({
    name: z2.string().min(2, "Name must be at least 2 characters"),
    email: z2.string().email("Invalid email format"),
    password: z2.string().min(8, "Password must be at least 8 characters"),
    role: z2.enum(["admin", "moderator", "editor"]),
    permissions: z2.array(z2.string()).optional()
  })), catchAsync(async (c) => {
    const userData = c.get("validatedBody");
    const db = createDatabase(c.env);
    const currentUser = c.get("user");
    try {
      const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth_workers(), auth_workers_exports));
      const passwordHash = await hashPassword2(userData.password);
      const newUser = {
        name: userData.name,
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role,
        permissions: JSON.stringify(userData.permissions || []),
        active: true,
        created_by: currentUser.id,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const result = await db.insert("admin_users", newUser);
      if (!result.success) {
        if (result.code === "DUPLICATE_ERROR") {
          return c.json({
            success: false,
            message: "User with this email already exists"
          }, 409);
        }
        return c.json({
          success: false,
          message: "Failed to create user"
        }, 500);
      }
      const { password_hash, ...userResponse } = result.data;
      return c.json({
        success: true,
        message: "User created successfully",
        data: userResponse
      }, 201);
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create user"
      }, 500);
    }
  }));
  app2.put("/admin/users/:id", requireAdmin, validateBody(z2.object({
    name: z2.string().min(2, "Name must be at least 2 characters").optional(),
    email: z2.string().email("Invalid email format").optional(),
    role: z2.enum(["admin", "moderator", "editor"]).optional(),
    permissions: z2.array(z2.string()).optional(),
    active: z2.boolean().optional()
  })), catchAsync(async (c) => {
    const userId = c.req.param("id");
    const updateData = c.get("validatedBody");
    const db = createDatabase(c.env);
    const currentUser = c.get("user");
    try {
      if (updateData.permissions) {
        updateData.permissions = JSON.stringify(updateData.permissions);
      }
      updateData.updated_by = currentUser.id;
      const result = await db.update("admin_users", userId, updateData);
      if (!result.success) {
        if (result.code === "NOT_FOUND") {
          return c.json({
            success: false,
            message: "User not found"
          }, 404);
        }
        return c.json({
          success: false,
          message: "Failed to update user"
        }, 500);
      }
      const { password_hash, ...userResponse } = result.data;
      return c.json({
        success: true,
        message: "User updated successfully",
        data: userResponse
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update user"
      }, 500);
    }
  }));
  app2.delete("/admin/users/:id", requireAdmin, catchAsync(async (c) => {
    const userId = c.req.param("id");
    const db = createDatabase(c.env);
    const currentUser = c.get("user");
    try {
      if (userId === currentUser.id) {
        return c.json({
          success: false,
          message: "Cannot delete your own account"
        }, 400);
      }
      const result = await db.delete("admin_users", userId, {
        deletedBy: currentUser.id
      });
      if (!result.success) {
        if (result.code === "NOT_FOUND") {
          return c.json({
            success: false,
            message: "User not found"
          }, 404);
        }
        return c.json({
          success: false,
          message: "Failed to delete user"
        }, 500);
      }
      return c.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete user"
      }, 500);
    }
  }));
  app2.get("/admin/health", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      const [healthCheck, stats] = await Promise.all([
        db.healthCheck(),
        db.getStats()
      ]);
      return c.json({
        success: true,
        message: "System health check completed",
        data: {
          database: healthCheck.data,
          statistics: stats.success ? stats.data : null,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Health check failed",
        data: {
          database: { status: "unhealthy" },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }, 500);
    }
  }));
  app2.get("/admin/audit-logs", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 50, action = "", user_id = "" } = c.req.query();
    try {
      const filters = {};
      if (action)
        filters.action = action;
      if (user_id)
        filters.user_id = user_id;
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        orderBy: "created_at DESC"
      };
      const result = await db.list("audit_logs", options);
      return c.json({
        success: true,
        message: "Audit logs fetched successfully",
        data: result.success ? result.data : [],
        pagination: result.success ? result.pagination : null
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch audit logs"
      }, 500);
    }
  }));
  app2.get("/admin/export/:table", requireAdmin, catchAsync(async (c) => {
    const table3 = c.req.param("table");
    const db = createDatabase(c.env);
    const { format = "json" } = c.req.query();
    const allowedTables = [
      "gallery_items",
      "events",
      "workshops",
      "artists",
      "blogs",
      "contact_submissions",
      "tickets"
    ];
    if (!allowedTables.includes(table3)) {
      return c.json({
        success: false,
        message: "Table not allowed for export"
      }, 400);
    }
    try {
      const result = await db.query(`SELECT * FROM ${table3} ORDER BY created_at DESC`);
      if (!result.success) {
        return c.json({
          success: false,
          message: "Failed to export data"
        }, 500);
      }
      if (format === "csv") {
        if (result.data.length === 0) {
          return new Response("", {
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="${table3}.csv"`
            }
          });
        }
        const headers = Object.keys(result.data[0]);
        const csvContent = [
          headers.join(","),
          ...result.data.map(
            (row) => headers.map(
              (header) => JSON.stringify(row[header] || "")
            ).join(",")
          )
        ].join("\n");
        return new Response(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${table3}.csv"`
          }
        });
      }
      return c.json({
        success: true,
        message: "Data exported successfully",
        data: result.data,
        meta: {
          table: table3,
          count: result.data.length,
          exported_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to export data"
      }, 500);
    }
  }));
  app2.get("/admin/gallery", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM artworks ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, image_url, thumbnail_url, artist, 
               category, medium, dimensions, 
               CASE 
                 WHEN year IS NULL THEN NULL
                 ELSE CAST(year AS INTEGER)
               END as year, 
               price, 
               available, slug, meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM artworks 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const artworks = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Gallery items fetched successfully",
        data: artworks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch gallery items",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/gallery", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const artworkData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const yearValue = artworkData.year ? parseInt(artworkData.year, 10) : null;
      const year = yearValue && !isNaN(yearValue) && yearValue >= 1 && yearValue <= 9999 ? yearValue : null;
      console.log('📥 Backend received artwork data:', { receivedYear: artworkData.year, parsedYearValue: yearValue, validatedYear: year });
      const query = `
        INSERT INTO artworks (
          id, title, artist, description, medium, dimensions, 
          year, price, category, image_url, available,
          meta_title, meta_description, meta_keywords, slug,
          og_title, og_description, og_image, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artworkData.title,
        artworkData.artist,
        artworkData.description || null,
        artworkData.medium || null,
        artworkData.dimensions || null,
        year,
        artworkData.price || null,
        artworkData.category || null,
        artworkData.image_url || null,
        artworkData.available !== false,
        artworkData.meta_title || null,
        artworkData.meta_description || null,
        artworkData.meta_keywords || null,
        artworkData.slug || null,
        artworkData.og_title || null,
        artworkData.og_description || null,
        artworkData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        console.log('[DATABASE] Artwork stored:', { id: result.data[0].id, year: result.data[0].year, yearType: typeof result.data[0].year });
        
        // Create notification for all users
        try {
          const priceInfo = artworkData.price ? `₹${artworkData.price.toLocaleString()}` : 'Price on request';
          const categoryInfo = artworkData.category ? ` | ${artworkData.category}` : '';
          const mediumInfo = artworkData.medium ? ` in ${artworkData.medium}` : '';
          
          await createNotificationForAllUsers(
            db,
            'gallery',
            `New ${artworkData.category || 'Artwork'} in Gallery`,
            `"${artworkData.title}" by ${artworkData.artist}${mediumInfo}${categoryInfo} - ${priceInfo}. Explore this stunning piece now!`,
            '/gallery'
          );
          console.log('[NOTIFICATION] Sent to all users for new artwork');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Artwork created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create artwork");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create artwork",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/gallery/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const artworkData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const yearValue = artworkData.year ? parseInt(artworkData.year, 10) : null;
      const year = yearValue && !isNaN(yearValue) && yearValue >= 1 && yearValue <= 9999 ? yearValue : null;
      console.log('📥 Backend received artwork update:', { id, receivedYear: artworkData.year, parsedYearValue: yearValue, validatedYear: year });
      const query = `
        UPDATE artworks SET
          title = $2, artist = $3, description = $4, medium = $5, dimensions = $6,
          year = $7, price = $8, category = $9, image_url = $10, available = $11,
          meta_title = $12, meta_description = $13, meta_keywords = $14,
          slug = $15, og_title = $16, og_description = $17, og_image = $18, updated_at = $19
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artworkData.title,
        artworkData.artist,
        artworkData.description || null,
        artworkData.medium || null,
        artworkData.dimensions || null,
        year,
        artworkData.price || null,
        artworkData.category || null,
        artworkData.image_url || null,
        artworkData.available !== false,
        artworkData.meta_title || null,
        artworkData.meta_description || null,
        artworkData.meta_keywords || null,
        artworkData.slug || null,
        artworkData.og_title || null,
        artworkData.og_description || null,
        artworkData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        console.log('[DATABASE] Artwork updated:', { id: result.data[0].id, year: result.data[0].year, yearType: typeof result.data[0].year });
        return c.json({
          success: true,
          message: "Artwork updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update artwork or artwork not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update artwork",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/gallery/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get artwork details before deleting
      const getQuery = `SELECT title FROM artworks WHERE id = $1`;
      const artworkResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM artworks WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific artwork
        if (artworkResult.success && artworkResult.data.length > 0) {
          const artworkTitle = artworkResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'gallery', artworkTitle);
            console.log(`[NOTIFICATION] Deleted notifications for artwork: ${artworkTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Artwork deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Artwork not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete artwork",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== MOMENTS API ENDPOINTS ====================
  // GET all moments with pagination
  app2.get("/admin/moments", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 20, search } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (search) {
        whereConditions.push(`event_name ILIKE $${paramIndex++}`);
        params.push(`%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM moments ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, event_name, photos, created_at, updated_at
        FROM moments 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const moments = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Moments fetched successfully",
        data: moments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch moments",
        error: error3.message
      }, 500);
    }
  }));

  // POST create new moment
  app2.post("/admin/moments", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const momentData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      
      // photos should be an array of image URLs
      const photosJson = JSON.stringify(momentData.photos || []);
      
      const query = `
        INSERT INTO moments (
          id, event_name, photos, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        momentData.event_name,
        photosJson,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Moment created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create moment");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create moment",
        error: error3.message
      }, 500);
    }
  }));

  // PUT update moment
  app2.put("/admin/moments/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const momentData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      
      // photos should be an array of image URLs
      const photosJson = JSON.stringify(momentData.photos || []);
      
      const query = `
        UPDATE moments SET
          event_name = $2, photos = $3, updated_at = $4
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        momentData.event_name,
        photosJson,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Moment updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update moment or moment not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update moment",
        error: error3.message
      }, 500);
    }
  }));

  // DELETE moment
  app2.delete("/admin/moments/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM moments WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Moment deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Moment not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete moment",
        error: error3.message
      }, 500);
    }
  }));

  // GET public moments (no auth required)
  app2.get("/moments", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 100 } = c.req.query();
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT id, event_name, photos, created_at
        FROM moments 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      const moments = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Moments fetched successfully",
        data: moments
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch moments",
        error: error3.message
      }, 500);
    }
  }));
  // ==================== END MOMENTS API ====================

  app2.get("/admin/events", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search, featured } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, category, start_date, end_date, venue, ticket_price, 
               max_attendees, current_attendees, image_url, video_url, district_url, book_my_show_url, featured, active,
               meta_title, meta_description, meta_keywords, slug, og_title, 
               og_description, og_image, created_at, updated_at
        FROM events 
        ${whereClause}
        ORDER BY featured DESC, start_date DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const events = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Events fetched successfully",
        data: events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch events",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/events", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const eventData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        INSERT INTO events (
          id, title, description, category, start_date, end_date, venue, ticket_price,
          max_attendees, current_attendees, image_url, video_url, district_url, book_my_show_url, featured, active,
          meta_title, meta_description, meta_keywords, slug, og_title,
          og_description, og_image, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        eventData.title,
        eventData.description || null,
        eventData.category || null,
        eventData.start_date || null,
        eventData.end_date || null,
        eventData.venue || null,
        eventData.ticket_price || null,
        eventData.max_attendees || null,
        eventData.current_attendees || 0,
        eventData.image_url || null,
        eventData.video_url || null,
        eventData.district_url || null,
        eventData.book_my_show_url || null,
        eventData.featured || false,
        eventData.active !== false,
        eventData.meta_title || null,
        eventData.meta_description || null,
        eventData.meta_keywords || null,
        eventData.slug || null,
        eventData.og_title || null,
        eventData.og_description || null,
        eventData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        // Create notification for all users
        try {
          const eventDate = eventData.start_date ? new Date(eventData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Coming Soon';
          const ticketInfo = eventData.ticket_price ? `Tickets from ₹${eventData.ticket_price}` : 'Free Entry';
          const venueInfo = eventData.venue ? ` at ${eventData.venue}` : '';
          const categoryInfo = eventData.category ? ` | ${eventData.category}` : '';
          
          await createNotificationForAllUsers(
            db,
            'event',
            `Upcoming Event: ${eventData.title}`,
            `Join us on ${eventDate}${venueInfo}${categoryInfo}. ${ticketInfo}. Book your spot now!`,
            '/events'
          );
          console.log('[NOTIFICATION] Sent to all users for new event');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Event created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create event",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/events/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const eventData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        UPDATE events SET
          title = $2, description = $3, category = $4, start_date = $5, end_date = $6, venue = $7,
          ticket_price = $8, max_attendees = $9, current_attendees = $10, image_url = $11, video_url = $12,
          district_url = $13, book_my_show_url = $14, featured = $15, active = $16, meta_title = $17, meta_description = $18,
          meta_keywords = $19, slug = $20, og_title = $21, og_description = $22,
          og_image = $23, updated_at = $24
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        eventData.title,
        eventData.description || null,
        eventData.category || null,
        eventData.start_date || null,
        eventData.end_date || null,
        eventData.venue || null,
        eventData.ticket_price || null,
        eventData.max_attendees || null,
        eventData.current_attendees || 0,
        eventData.image_url || null,
        eventData.video_url || null,
        eventData.district_url || null,
        eventData.book_my_show_url || null,
        eventData.featured || false,
        eventData.active !== false,
        eventData.meta_title || null,
        eventData.meta_description || null,
        eventData.meta_keywords || null,
        eventData.slug || null,
        eventData.og_title || null,
        eventData.og_description || null,
        eventData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Event updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update event or event not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update event",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/events/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get event details before deleting
      const getQuery = `SELECT title FROM events WHERE id = $1`;
      const eventResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific event
        if (eventResult.success && eventResult.data.length > 0) {
          const eventTitle = eventResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'event', eventTitle);
            console.log(`[NOTIFICATION] Deleted notifications for event: ${eventTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Event deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Event not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete event",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/admin/workshops", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM workshops ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, instructor, start_date, end_date, venue, duration,
               price, max_participants, current_participants, image_url, active,
               meta_title, meta_description, meta_keywords, slug, og_title, 
               og_description, og_image, created_at, updated_at
        FROM workshops 
        ${whereClause}
        ORDER BY start_date DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const workshops = result.success ? result.data.map(w => ({
        ...w,
        startDate: w.start_date,
        endDate: w.end_date,
        imageUrl: w.image_url,
        maxParticipants: w.max_participants,
        currentParticipants: w.current_participants,
        metaTitle: w.meta_title,
        metaDescription: w.meta_description,
        metaKeywords: w.meta_keywords,
        ogTitle: w.og_title,
        ogDescription: w.og_description,
        ogImage: w.og_image,
        createdAt: w.created_at,
        updatedAt: w.updated_at
      })) : [];
      return c.json({
        success: true,
        message: "Workshops fetched successfully",
        data: workshops,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch workshops",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/workshops", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const workshopData = await c.req.json();
    
    console.log('🔍 Backend received workshop data:', {
      max_participants: workshopData.max_participants,
      max_participants_type: typeof workshopData.max_participants,
      price: workshopData.price,
      price_type: typeof workshopData.price
    });
    
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        INSERT INTO workshops (
          id, title, description, instructor, start_date, end_date, venue, duration,
          price, max_participants, current_participants, image_url, active,
          meta_title, meta_description, meta_keywords, slug, og_title,
          og_description, og_image, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        workshopData.title,
        workshopData.description || null,
        workshopData.instructor || null,
        workshopData.start_date || null,
        workshopData.end_date || null,
        (workshopData.venue ?? workshopData.venue_name) || null,
        workshopData.duration || null,
        workshopData.price || null,
        workshopData.max_participants || null,
        workshopData.current_participants || 0,
        workshopData.image_url || null,
        workshopData.active !== false,
        workshopData.meta_title || null,
        workshopData.meta_description || null,
        workshopData.meta_keywords || null,
        workshopData.slug || null,
        workshopData.og_title || null,
        workshopData.og_description || null,
        workshopData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        const workshop = result.data[0];
        
        console.log('[DATABASE] Workshop created:', {
          id: workshop.id,
          max_participants: workshop.max_participants,
          max_participants_type: typeof workshop.max_participants,
          price: workshop.price,
          price_type: typeof workshop.price
        });
        
        const transformedWorkshop = {
          ...workshop,
          startDate: workshop.start_date,
          endDate: workshop.end_date,
          imageUrl: workshop.image_url,
          maxParticipants: workshop.max_participants,
          currentParticipants: workshop.current_participants,
          metaTitle: workshop.meta_title,
          metaDescription: workshop.meta_description,
          metaKeywords: workshop.meta_keywords,
          ogTitle: workshop.og_title,
          ogDescription: workshop.og_description,
          ogImage: workshop.og_image,
          createdAt: workshop.created_at,
          updatedAt: workshop.updated_at
        };
        
        // Create notification for all users
        try {
          const startDate = workshopData.start_date ? new Date(workshopData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Soon';
          const priceInfo = workshopData.price ? `₹${workshopData.price}` : 'Free';
          const seatsInfo = workshopData.max_participants ? ` | Limited to ${workshopData.max_participants} seats` : '';
          const instructorInfo = workshopData.instructor ? ` with ${workshopData.instructor}` : '';
          const durationInfo = workshopData.duration ? ` (${workshopData.duration})` : '';
          
          await createNotificationForAllUsers(
            db,
            'workshop',
            `New Workshop Available: ${workshopData.title}`,
            `Starting ${startDate}${instructorInfo}${durationInfo}. Fee: ${priceInfo}${seatsInfo}. Register before seats fill up!`,
            '/workshops'
          );
          console.log('[NOTIFICATION] Sent to all users for new workshop');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Workshop created successfully",
          data: transformedWorkshop
        }, 201);
      } else {
        throw new Error("Failed to create workshop");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create workshop",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/workshops/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const workshopData = await c.req.json();
    
    console.log('🔍 Backend received workshop update data:', {
      id: id,
      max_participants: workshopData.max_participants,
      max_participants_type: typeof workshopData.max_participants,
      price: workshopData.price,
      price_type: typeof workshopData.price
    });
    
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        UPDATE workshops SET
          title = $2, description = $3, instructor = $4, start_date = $5, end_date = $6,
          venue = $7, duration = $8, price = $9, max_participants = $10, current_participants = $11,
          image_url = $12, active = $13, meta_title = $14,
          meta_description = $15, meta_keywords = $16, slug = $17, og_title = $18,
          og_description = $19, og_image = $20, updated_at = $21
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        workshopData.title,
        workshopData.description || null,
        workshopData.instructor || null,
        workshopData.start_date || null,
        workshopData.end_date || null,
        (workshopData.venue ?? workshopData.venue_name) || null,
        workshopData.duration || null,
        workshopData.price || null,
        workshopData.max_participants || null,
        workshopData.current_participants || 0,
        workshopData.image_url || null,
        workshopData.active !== false,
        workshopData.meta_title || null,
        workshopData.meta_description || null,
        workshopData.meta_keywords || null,
        workshopData.slug || null,
        workshopData.og_title || null,
        workshopData.og_description || null,
        workshopData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        const workshop = result.data[0];
        
        console.log('[DATABASE] Workshop updated:', {
          id: workshop.id,
          max_participants: workshop.max_participants,
          max_participants_type: typeof workshop.max_participants,
          price: workshop.price,
          price_type: typeof workshop.price
        });
        
        const transformedWorkshop = {
          ...workshop,
          startDate: workshop.start_date,
          endDate: workshop.end_date,
          imageUrl: workshop.image_url,
          maxParticipants: workshop.max_participants,
          currentParticipants: workshop.current_participants,
          metaTitle: workshop.meta_title,
          metaDescription: workshop.meta_description,
          metaKeywords: workshop.meta_keywords,
          ogTitle: workshop.og_title,
          ogDescription: workshop.og_description,
          ogImage: workshop.og_image,
          createdAt: workshop.created_at,
          updatedAt: workshop.updated_at
        };
        return c.json({
          success: true,
          message: "Workshop updated successfully",
          data: transformedWorkshop
        });
      } else {
        throw new Error("Failed to update workshop or workshop not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update workshop",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/workshops/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get workshop details before deleting
      const getQuery = `SELECT title FROM workshops WHERE id = $1`;
      const workshopResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM workshops WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific workshop
        if (workshopResult.success && workshopResult.data.length > 0) {
          const workshopTitle = workshopResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'workshop', workshopTitle);
            console.log(`[NOTIFICATION] Deleted notifications for workshop: ${workshopTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Workshop deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Workshop not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete workshop",
        error: error3.message
      }, 500);
    }
  }));
  // Public ArtParty images endpoint (no auth)
  app2.get("/artparty/images", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      // Ensure images table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id UUID PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url TEXT,
          alt_text VARCHAR(255),
          category VARCHAR(100),
          tags JSONB DEFAULT '[]',
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const featuredOnly = c.req.query("featured");
      const params = ["artparty"]; // $1 category
      let where = "WHERE LOWER(category) = LOWER($1) AND image_url IS NOT NULL";
      if (featuredOnly === "true") {
        where += " AND featured = true";
      }
      const query = `
        SELECT id, title, image_url, alt_text, featured, created_at
        FROM images
        ${where}
        ORDER BY featured DESC, created_at DESC
        LIMIT 50
      `;
      const result = await db.query(query, params);
      const items = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "ArtParty images fetched",
        data: items
      });
    } catch (error3) {
      return c.json({ success: false, message: "Failed to fetch ArtParty images", error: error3.message }, 500);
    }
  }));
  app2.get("/admin/artists", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search, featured } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (search) {
        whereConditions.push(`(name ILIKE $${paramIndex++} OR bio ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM artists ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, name, bio, specialization, email, phone, website, image_url,
               social_links, featured, active, meta_title, meta_description,
               meta_keywords, slug, og_title, og_description, og_image,
               created_at, updated_at
        FROM artists 
        ${whereClause}
        ORDER BY featured DESC, created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const artists = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Artists fetched successfully",
        data: artists,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch artists",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/artists", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const artistData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        INSERT INTO artists (
          id, name, bio, specialization, email, phone, website, image_url,
          social_links, featured, active, meta_title, meta_description,
          meta_keywords, slug, og_title, og_description, og_image,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artistData.name,
        artistData.bio || null,
        artistData.specialization || null,
        artistData.email || null,
        artistData.phone || null,
        artistData.website || null,
        artistData.image_url || null,
        artistData.social_links || null,
        artistData.featured || false,
        artistData.active !== false,
        artistData.meta_title || null,
        artistData.meta_description || null,
        artistData.meta_keywords || null,
        artistData.slug || null,
        artistData.og_title || null,
        artistData.og_description || null,
        artistData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Artist created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create artist");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create artist",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/artists/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const artistData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        UPDATE artists SET
          name = $2, bio = $3, specialization = $4, email = $5, phone = $6,
          website = $7, image_url = $8, social_links = $9, featured = $10,
          active = $11, meta_title = $12, meta_description = $13,
          meta_keywords = $14, slug = $15, og_title = $16, og_description = $17,
          og_image = $18, updated_at = $19
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artistData.name,
        artistData.bio || null,
        artistData.specialization || null,
        artistData.email || null,
        artistData.phone || null,
        artistData.website || null,
        artistData.image_url || null,
        artistData.social_links || null,
        artistData.featured || false,
        artistData.active !== false,
        artistData.meta_title || null,
        artistData.meta_description || null,
        artistData.meta_keywords || null,
        artistData.slug || null,
        artistData.og_title || null,
        artistData.og_description || null,
        artistData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Artist updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update artist or artist not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update artist",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/artists/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM artists WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Artist deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Artist not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete artist",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/admin/blogs", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search, featured, published } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (published !== void 0) {
        whereConditions.push(`published = $${paramIndex++}`);
        params.push(published === "true");
      }
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR content ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM blogs ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, content, excerpt, author, category, tags, image_url,
               published, featured, read_time, meta_title, meta_description,
               meta_keywords, slug, og_title, og_description, og_image,
               created_at, updated_at
        FROM blogs 
        ${whereClause}
        ORDER BY featured DESC, created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const blogs = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch blogs",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/blogs", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const blogData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        INSERT INTO blogs (
          id, title, content, excerpt, author, category, tags, image_url,
          published, featured, read_time, meta_title, meta_description,
          meta_keywords, slug, og_title, og_description, og_image,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        blogData.title,
        blogData.content || null,
        blogData.excerpt || null,
        blogData.author || null,
        blogData.category || null,
        blogData.tags || null,
        blogData.image_url || null,
        blogData.published || false,
        blogData.featured || false,
        blogData.read_time || null,
        blogData.meta_title || null,
        blogData.meta_description || null,
        blogData.meta_keywords || null,
        blogData.slug || null,
        blogData.og_title || null,
        blogData.og_description || null,
        blogData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        // Create notification for all users
        try {
          const authorInfo = blogData.author || 'Kalakritam Team';
          const categoryInfo = blogData.category ? ` | ${blogData.category}` : '';
          const readTimeInfo = blogData.read_time ? ` | ${blogData.read_time} min read` : '';
          const excerptInfo = blogData.excerpt ? ` - ${blogData.excerpt.substring(0, 80)}${blogData.excerpt.length > 80 ? '...' : ''}` : '';
          
          await createNotificationForAllUsers(
            db,
            'blog',
            `New Article Published: ${blogData.title}`,
            `By ${authorInfo}${categoryInfo}${readTimeInfo}${excerptInfo}. Dive into this insightful article now!`,
            '/blogs'
          );
          console.log('[NOTIFICATION] Sent to all users for new blog');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Blog created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create blog");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create blog",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/blogs/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const blogData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        UPDATE blogs SET
          title = $2, content = $3, excerpt = $4, author = $5, category = $6,
          tags = $7, image_url = $8, published = $9, featured = $10,
          read_time = $11, meta_title = $12, meta_description = $13,
          meta_keywords = $14, slug = $15, og_title = $16, og_description = $17,
          og_image = $18, updated_at = $19
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        blogData.title,
        blogData.content || null,
        blogData.excerpt || null,
        blogData.author || null,
        blogData.category || null,
        blogData.tags || null,
        blogData.image_url || null,
        blogData.published || false,
        blogData.featured || false,
        blogData.read_time || null,
        blogData.meta_title || null,
        blogData.meta_description || null,
        blogData.meta_keywords || null,
        blogData.slug || null,
        blogData.og_title || null,
        blogData.og_description || null,
        blogData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Blog updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update blog or blog not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update blog",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/blogs/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get blog details before deleting
      const getQuery = `SELECT title FROM blogs WHERE id = $1`;
      const blogResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM blogs WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific blog
        if (blogResult.success && blogResult.data.length > 0) {
          const blogTitle = blogResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'blog', blogTitle);
            console.log(`[NOTIFICATION] Deleted notifications for blog: ${blogTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Blog deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Blog not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete blog",
        error: error3.message
      }, 500);
    }
  }));
  // Admin Images (ArtParty Images) CRUD Endpoints
  app2.get("/admin/images", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 20, search, category, featured } = c.req.query();
    try {
      // Ensure images table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id UUID PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url TEXT,
          alt_text VARCHAR(255),
          category VARCHAR(100),
          tags JSONB DEFAULT '[]',
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (category) {
        whereConditions.push(`LOWER(category) = LOWER($${paramIndex++})`);
        params.push(category);
      }
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++} OR alt_text ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM images ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, image_url, alt_text, category,
               tags, featured, created_at, updated_at
        FROM images
        ${whereClause}
        ORDER BY featured DESC, created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const items = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Images fetched successfully",
        data: items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch images",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/admin/images", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const body = await c.req.json();
    try {
      // Ensure images table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id UUID PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url TEXT,
          alt_text VARCHAR(255),
          category VARCHAR(100),
          tags JSONB DEFAULT '[]',
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const id = crypto.randomUUID();
      const now = (new Date()).toISOString();
      const query = `
        INSERT INTO images (
          id, title, description, image_url, alt_text, category,
          tags, featured, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        body.title || null,
        body.description || null,
        body.image_url || body.imageUrl || null,
        body.altText || null,
        body.category || 'artparty',
        Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || []),
        body.featured || false,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Image created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create image");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create image",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/images/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const body = await c.req.json();
    try {
      // Ensure images table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id UUID PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url TEXT,
          alt_text VARCHAR(255),
          category VARCHAR(100),
          tags JSONB DEFAULT '[]',
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const now = (new Date()).toISOString();
      const query = `
        UPDATE images SET
          title = $2, description = $3, image_url = $4, alt_text = $5,
          category = $6, tags = $7, featured = $8, updated_at = $9
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        body.title || null,
        body.description || null,
        body.image_url || body.imageUrl || null,
        body.altText || null,
        body.category || 'artparty',
        Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || []),
        body.featured || false,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Image updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update image or image not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update image",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/images/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Ensure images table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id UUID PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url TEXT,
          alt_text VARCHAR(255),
          category VARCHAR(100),
          tags JSONB DEFAULT '[]',
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const query = `DELETE FROM images WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Image deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Image not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete image",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/admin/contacts", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search, status } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (status) {
        whereConditions.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      if (search) {
        whereConditions.push(`(name ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++} OR subject ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, name, email, phone, subject, message, status, is_read,
               created_at, updated_at
        FROM contacts 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const contacts = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Contacts fetched successfully",
        data: contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch contacts",
        error: error3.message
      }, 500);
    }
  }));
  app2.put("/admin/contacts/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const contactData = await c.req.json();
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const query = `
        UPDATE contacts SET
          status = $2, is_read = $3, updated_at = $4
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        contactData.status || "new",
        contactData.is_read !== false,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Contact updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update contact or contact not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update contact",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/admin/contacts/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM contacts WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Contact deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Contact not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete contact",
        error: error3.message
      }, 500);
    }
  }));
}, "setupAdminRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth_workers();
var setupUploadRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.post("/upload/image", authenticateAdminOrUser, catchAsync(async (c) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get("file");
  const folder = formData.get("folder") || "general";
  const providedName = formData.get("name");
      if (!file) {
        return c.json({
          success: false,
          message: "No file provided"
        }, 400);
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({
          success: false,
          message: "Invalid file type. Only JPEG, PNG, GIF, WebP images and MP4, WebM videos are allowed"
        }, 400);
      }
      // Different max size for images (5MB) and videos (50MB)
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return c.json({
          success: false,
          message: `File too large. Maximum size is ${isVideo ? '50MB' : '5MB'}`
        }, 400);
      }
      // Allow specific folders, including hero-banners
      const validFolders = ["artworks", "workshops", "events", "artists", "blogs", "images", "artparty", "artpartyimages", "hero-banners", "user-profiles", "general"];
      const sanitizedFolder = validFolders.includes(folder) ? folder : "general";
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      // Optional name-based filename
      let filename;
      if (providedName && typeof providedName === "string" && providedName.trim().length > 0) {
        const base = providedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .substring(0, 80);
        filename = `${sanitizedFolder}/${base}-${timestamp}.${fileExtension}`;
      } else {
        filename = `${sanitizedFolder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      }
      if (c.env.R2_BUCKET) {
        try {
          await c.env.R2_BUCKET.put(filename, file.stream(), {
            httpMetadata: {
              contentType: file.type
            }
          });
          const publicUrl = c.env.CLOUDFLARE_R2_PUBLIC_URL ? `${c.env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}` : `https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/${filename}`;
          return c.json({
            success: true,
            message: "Image uploaded successfully to R2",
            data: {
              url: publicUrl,
              filename,
              key: filename,
              folder: sanitizedFolder,
              size: file.size,
              type: file.type
            }
          });
        } catch (r2Error) {
          console.error("R2 Upload Error:", r2Error);
          return c.json({
            success: false,
            message: "Failed to upload to R2 storage",
            error: r2Error.message
          }, 500);
        }
      } else {
        return c.json({
          success: false,
          message: "R2 storage not configured. Please check bucket binding.",
          error: "R2_BUCKET environment binding is missing"
        }, 500);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to upload image",
        error: error3.message
      }, 500);
    }
  }));
  app2.delete("/upload/image/:key", authenticateToken, catchAsync(async (c) => {
    try {
      const key = decodeURIComponent(c.req.param("key"));
      if (!key) {
        return c.json({
          success: false,
          message: "No image key provided"
        }, 400);
      }
      console.log("Deleting image with key:", key);
      if (c.env.R2_BUCKET) {
        await c.env.R2_BUCKET.delete(key);
        return c.json({
          success: true,
          message: "Image deleted successfully from R2",
          data: { key }
        });
      } else {
        return c.json({
          success: true,
          message: "Image deleted successfully (development mode)",
          data: { key }
        });
      }
    } catch (error3) {
      console.error("Delete error:", error3);
      return c.json({
        success: false,
        message: "Failed to delete image",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/upload/pdf", authenticateToken, catchAsync(async (c) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get("file");
      const folder = formData.get("folder") || "tickets";
      const ticketId = formData.get("ticketId");
      if (!file) {
        return c.json({
          success: false,
          message: "No PDF file provided"
        }, 400);
      }
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({
          success: false,
          message: "Invalid file type. Only PDF files are allowed"
        }, 400);
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return c.json({
          success: false,
          message: "PDF file too large. Maximum size is 10MB"
        }, 400);
      }
      const validFolders = ["tickets", "documents"];
      const sanitizedFolder = validFolders.includes(folder) ? folder : "tickets";
      const timestamp = Date.now();
      const fileName = ticketId ? `ticket_${ticketId}_${timestamp}.pdf` : `document_${timestamp}.pdf`;
      const fullPath = `${sanitizedFolder}/${fileName}`;
      if (c.env.R2_BUCKET) {
        try {
          await c.env.R2_BUCKET.put(fullPath, file.stream(), {
            httpMetadata: {
              contentType: file.type
            }
          });
          const publicUrl = c.env.CLOUDFLARE_R2_PUBLIC_URL ? `${c.env.CLOUDFLARE_R2_PUBLIC_URL}/${fullPath}` : `https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/${fullPath}`;
          return c.json({
            success: true,
            message: "PDF uploaded successfully to R2",
            data: {
              url: publicUrl,
              filename: fullPath,
              key: fullPath,
              folder: sanitizedFolder,
              size: file.size,
              type: file.type,
              ticketId
            }
          });
        } catch (r2Error) {
          console.error("R2 PDF Upload Error:", r2Error);
          return c.json({
            success: false,
            message: "Failed to upload PDF to R2 storage",
            error: r2Error.message
          }, 500);
        }
      } else {
        return c.json({
          success: false,
          message: "R2 storage not configured. Please check bucket binding.",
          error: "R2_BUCKET environment binding is missing"
        }, 500);
      }
    } catch (error3) {
      console.error("PDF upload error:", error3);
      return c.json({
        success: false,
        message: "Failed to upload PDF",
        error: error3.message
      }, 500);
    }
  }));
  app2.post("/upload/presigned-url", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { filename, contentType } = body;
      if (!filename) {
        return c.json({
          success: false,
          message: "Filename is required"
        }, 400);
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (contentType && !allowedTypes.includes(contentType)) {
        return c.json({
          success: false,
          message: "Invalid content type. Only JPEG, PNG, GIF, and WebP images are allowed"
        }, 400);
      }
      const timestamp = Date.now();
      const fileExtension = filename.split(".").pop();
      const uniqueFilename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      if (c.env.R2_BUCKET) {
        const publicUrl = c.env.CLOUDFLARE_R2_PUBLIC_URL ? `${c.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueFilename}` : `https://pub-9cdd84716e0341ba9fa9c0b6875b5572.r2.dev/${uniqueFilename}`;
        return c.json({
          success: true,
          message: "Use direct upload endpoint instead of presigned URL",
          data: {
            uploadEndpoint: "/upload/image",
            fileUrl: publicUrl,
            filename: uniqueFilename,
            note: "Upload the file directly to /upload/image endpoint with form-data"
          }
        });
      } else {
        return c.json({
          success: true,
          message: "Presigned URL generated successfully (development mode)",
          data: {
            uploadUrl: "https://example.com/presigned-upload-url",
            fileUrl: `https://example.com/${uniqueFilename}`,
            filename: uniqueFilename
          }
        });
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to generate presigned URL",
        error: error3.message
      }, 500);
    }
  }));
}, "setupUploadRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth_workers();
var setupImageRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.get("/images/:key", optionalAuth, catchAsync(async (c) => {
    try {
      const key = c.req.param("key");
      return c.json({
        success: true,
        message: "Image details fetched successfully",
        data: {
          key,
          url: `https://example.com/${key}`,
          metadata: {}
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch image details",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/images/:key/optimized", optionalAuth, catchAsync(async (c) => {
    try {
      const key = c.req.param("key");
      const width = c.req.query("w");
      const height = c.req.query("h");
      const quality = c.req.query("q") || "80";
      return c.json({
        success: true,
        message: "Optimized image URL generated",
        data: {
          url: `https://example.com/${key}?w=${width}&h=${height}&q=${quality}`,
          original: `https://example.com/${key}`
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to generate optimized image",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/images", authenticateToken, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 20;
      return c.json({
        success: true,
        message: "Images fetched successfully",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch images",
        error: error3.message
      }, 500);
    }
  }));
}, "setupImageRoutes");
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth_workers();
init_database_workers();
init_auth_workers();
var setupDebugRoutes = /* @__PURE__ */ __name2((app2) => {
  app2.post("/debug/fix-admin-password", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth_workers(), auth_workers_exports));
      const passwordHash = await hashPassword2("admin123");
      const updateResult = await db.query(
        "UPDATE admin_users SET password = $1 WHERE email = $2 RETURNING id, name, email, role",
        [passwordHash, "admin@kalakritam.in"]
      );
      return c.json({
        success: true,
        message: "Admin password hash updated successfully",
        data: {
          updated: updateResult.data?.[0] || null,
          passwordHashLength: passwordHash?.length || 0,
          rowsAffected: updateResult.data?.length || 0
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update admin password",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/all-tables-check", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const tables = ["events", "workshops", "artists", "blogs", "contacts", "tickets"];
      const results = {};
      for (const tableName of tables) {
        try {
          const structure = await db.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = $1 AND table_schema = 'public'
            ORDER BY ordinal_position
          `, [tableName]);
          const count3 = await db.query(`SELECT COUNT(*) as total FROM ${tableName}`);
          const sample = await db.query(`SELECT * FROM ${tableName} LIMIT 3`);
          results[tableName] = {
            structure,
            count: count3,
            sampleData: sample
          };
        } catch (error3) {
          results[tableName] = {
            error: error3.message
          };
        }
      }
      return c.json({
        success: true,
        message: "All tables structure check",
        data: results
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Tables check failed",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/artworks-check", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const artworksTableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'artworks' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      const artworksCount = await db.query("SELECT COUNT(*) as total FROM artworks");
      const artworksData = await db.query("SELECT * FROM artworks LIMIT 10");
      const galleryTableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      const galleryCount = await db.query("SELECT COUNT(*) as total FROM gallery");
      const galleryData = await db.query("SELECT * FROM gallery LIMIT 10");
      return c.json({
        success: true,
        message: "Artworks and Gallery table check",
        data: {
          artworks: {
            structure: artworksTableCheck,
            count: artworksCount,
            sampleData: artworksData
          },
          gallery: {
            structure: galleryTableCheck,
            count: galleryCount,
            sampleData: galleryData
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Artworks check failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app2.get("/debug/db-complete", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const testQuery = await db.query("SELECT NOW() as current_time, version() as pg_version");
      const tablesQuery = await db.query(`
        SELECT table_name, table_schema 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      const adminTableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'admin_users' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      const adminUsers = await db.query("SELECT id, name, email, role, active, created_at FROM admin_users");
      const adminCount = await db.query("SELECT COUNT(*) as total FROM admin_users");
      return c.json({
        success: true,
        message: "Complete database debug",
        data: {
          environment: {
            hasEnvironment: !!c.env,
            hasDatabaseUrl: !!c.env?.DATABASE_URL,
            databaseUrl: c.env?.DATABASE_URL?.substring(0, 80) + "...",
            nodeEnv: c.env?.NODE_ENV || "unknown"
          },
          connectivity: testQuery,
          schema: {
            allTables: tablesQuery,
            adminTableStructure: adminTableCheck
          },
          adminData: {
            count: adminCount,
            users: adminUsers
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Complete database debug failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app2.post("/debug/test-password", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const { hashPassword: hashPassword2, comparePassword: comparePassword2 } = await Promise.resolve().then(() => (init_auth_workers(), auth_workers_exports));
      const adminResult = await db.query("SELECT * FROM admin_users WHERE email = $1", ["admin@kalakritam.in"]);
      if (!adminResult.success || adminResult.data.length === 0) {
        return c.json({
          success: false,
          message: "Admin user not found"
        }, 404);
      }
      const admin = adminResult.data[0];
      const testPassword = "admin123";
      const isValid2 = await comparePassword2(testPassword, admin.password_hash);
      const newHash = await hashPassword2(testPassword);
      return c.json({
        success: true,
        message: "Password test results",
        data: {
          admin: {
            id: admin.id,
            email: admin.email,
            hasPasswordHash: !!admin.password_hash,
            passwordHashLength: admin.password_hash?.length || 0
          },
          passwordTest: {
            testPassword,
            isValid: isValid2,
            storedHashLength: admin.password_hash?.length,
            newHashLength: newHash?.length,
            hashesMatch: admin.password_hash === newHash
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Password test failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app2.post("/debug/fix-admin-email", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const updateResult = await db.query(
        "UPDATE admin_users SET email = $1 WHERE email = $2 RETURNING id, name, email, role",
        ["admin@kalakritam.in", "admin@kalakritam.com"]
      );
      return c.json({
        success: true,
        message: "Admin email updated successfully",
        data: {
          updated: updateResult.data?.[0] || null,
          rowsAffected: updateResult.data?.length || 0
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update admin email",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/db-direct", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const testQuery = await db.query("SELECT 1 as test");
      const adminCheck = await db.query("SELECT COUNT(*) as count FROM admin_users");
      const adminList = await db.query("SELECT id, name, email, role, active, created_at FROM admin_users LIMIT 5");
      return c.json({
        success: true,
        message: "Direct database test",
        data: {
          basicTest: testQuery,
          adminCount: adminCheck,
          adminUsers: adminList,
          hasEnvironment: !!c.env,
          hasDatabaseUrl: !!c.env?.DATABASE_URL,
          databaseUrl: c.env?.DATABASE_URL?.substring(0, 50) + "..."
          // Show first 50 chars for debugging
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Database test failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app2.post("/debug/init-database", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const existingAdmins = await db.query("SELECT COUNT(*) as count FROM admin_users WHERE active = true");
      if (existingAdmins.success && existingAdmins.data[0]?.count > 0) {
        return c.json({
          success: false,
          message: "Database already initialized with admin users"
        }, 409);
      }
      const createAdminUsersTable = `
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'editor')),
          avatar TEXT,
          permissions JSONB DEFAULT '[]',
          active BOOLEAN DEFAULT true,
          created_by INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP WITH TIME ZONE,
          last_logout TIMESTAMP WITH TIME ZONE
        )
      `;
      await db.query(createAdminUsersTable);
      const createGalleryTable = `
        CREATE TABLE IF NOT EXISTS gallery (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url TEXT NOT NULL,
          thumbnail_url TEXT,
          artist_name VARCHAR(255),
          artwork_type VARCHAR(100),
          medium VARCHAR(100),
          dimensions VARCHAR(100),
          year_created INTEGER,
          price DECIMAL(10,2),
          tags TEXT[],
          featured BOOLEAN DEFAULT false,
          active BOOLEAN DEFAULT true,
          created_by INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await db.query(createGalleryTable);
      const passwordHash = await hashPassword("admin123");
      const insertAdmin = await db.query(`
        INSERT INTO admin_users (name, email, password_hash, role, permissions, active, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, role, created_at
      `, [
        "Kalakritam Admin",
        "admin@kalakritam.com",
        passwordHash,
        "admin",
        JSON.stringify(["all"]),
        true,
        (/* @__PURE__ */ new Date()).toISOString()
      ]);
      if (!insertAdmin.success) {
        throw new Error("Failed to create admin user");
      }
      return c.json({
        success: true,
        message: "Database initialized successfully",
        data: {
          adminUser: insertAdmin.data[0],
          credentials: {
            email: "admin@kalakritam.com",
            password: "admin123"
          }
        }
      });
    } catch (error3) {
      console.error("Database initialization error:", error3);
      return c.json({
        success: false,
        message: "Database initialization failed",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/info", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "Debug information",
        data: {
          environment: c.env?.NODE_ENV || "unknown",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          hasDatabase: !!c.env?.DATABASE_URL,
          hasR2: !!c.env?.R2_BUCKET,
          hasKV: !!c.env?.CACHE_KV,
          userAgent: c.req.header("user-agent"),
          ip: c.req.header("cf-connecting-ip") || "unknown"
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to get debug info",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/test-db", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "Database test completed",
        data: {
          connected: true,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Database test failed",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/test-r2", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "R2 test completed",
        data: {
          connected: true,
          bucket: c.env?.R2_BUCKET ? "available" : "not configured"
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "R2 test failed",
        error: error3.message
      }, 500);
    }
  }));
  app2.get("/debug/health", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "System health check",
        data: {
          status: "healthy",
          uptime: "0d 0h 0m 0s",
          memory: "N/A (Workers)",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Health check failed",
        error: error3.message
      }, 500);
    }
  }));
}, "setupDebugRoutes");
var app = new Hono2();
app.use("*", async (c, next) => {
  const origin = c.req.header("Origin");
  const allowedOrigins = [
    "https://kalakritam.in",
    "https://www.kalakritam.in",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
  ];
  if (origin && allowedOrigins.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    c.header("Access-Control-Allow-Credentials", "true");
  } else if (!origin) {
    c.header("Access-Control-Allow-Origin", "*");
    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }
  await next();
});
app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "Kalakritam Backend API is running on Cloudflare Workers",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: c.env?.NODE_ENV || "production",
    version: "2.0.0"
  });
});
app.get("/test-db", async (c) => {
  try {
    return c.json({
      success: true,
      message: "Database connection test - ready for implementation",
      hasEnvironment: !!c.env,
      hasDatabaseUrl: !!c.env?.DATABASE_URL,
      environment: c.env?.NODE_ENV || "unknown"
    });
  } catch (error3) {
    return c.json({
      success: false,
      message: "Database test failed",
      error: error3.message
    }, 500);
  }
});

// Hero Banners Routes
var setupHeroBannersRoutes = /* @__PURE__ */ __name2((app2) => {
  // Get all active hero banners (public)
  app2.get("/hero-banners", optionalAuth, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const query = `
        SELECT id, title, media_type, media_url, link_url, order_index, active, created_at, updated_at
        FROM hero_banners 
        WHERE active = true
        ORDER BY order_index ASC
      `;
      const result = await db.query(query);
      
      if (!result.success) {
        throw new Error(result.error || "Database query failed");
      }
      
      const banners = result.data || [];
      
      return c.json({
        success: true,
        message: "Hero banners fetched successfully",
        data: banners
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch hero banners",
        error: error3.message
      }, 500);
    }
  }));

  // Get all hero banners (admin)
  app2.get("/admin/hero-banners", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const { page = 1, limit = 20 } = c.req.query();
      
      const offset = (page - 1) * limit;
      const countQuery = `SELECT COUNT(*) as total FROM hero_banners`;
      const countResult = await db.query(countQuery);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      
      const query = `
        SELECT id, title, media_type, media_url, link_url, order_index, active, created_at, updated_at
        FROM hero_banners 
        ORDER BY order_index ASC, created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      const banners = result.success ? result.data : [];
      
      return c.json({
        success: true,
        message: "Hero banners fetched successfully",
        data: banners,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch hero banners",
        error: error3.message
      }, 500);
    }
  }));

  // Create hero banner (admin)
  app2.post("/admin/hero-banners", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const bannerData = await c.req.json();
      const id = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      
      const query = `
        INSERT INTO hero_banners (
          id, title, media_type, media_url, link_url, order_index, active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const result = await db.query(query, [
        id,
        bannerData.title || null,
        bannerData.media_type || 'image',
        bannerData.media_url || null,
        bannerData.link_url || null,
        bannerData.order_index || 0,
        bannerData.active !== false,
        now,
        now
      ]);
      
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Hero banner created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create hero banner");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create hero banner",
        error: error3.message
      }, 500);
    }
  }));

  // Update hero banner (admin)
  app2.put("/admin/hero-banners/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const id = c.req.param("id");
      const bannerData = await c.req.json();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      
      const query = `
        UPDATE hero_banners SET
          title = $2, media_type = $3, media_url = $4, link_url = $5,
          order_index = $6, active = $7, updated_at = $8
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await db.query(query, [
        id,
        bannerData.title || null,
        bannerData.media_type || 'image',
        bannerData.media_url || null,
        bannerData.link_url || null,
        bannerData.order_index || 0,
        bannerData.active !== false,
        now
      ]);
      
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Hero banner updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update hero banner or banner not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update hero banner",
        error: error3.message
      }, 500);
    }
  }));

  // Delete hero banner (admin)
  app2.delete("/admin/hero-banners/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const id = c.req.param("id");
      
      const query = `DELETE FROM hero_banners WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Hero banner deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Hero banner not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete hero banner",
        error: error3.message
      }, 500);
    }
  }));
}, "setupHeroBannersRoutes");

setupAuthRoutes(app);
setupUserAuthRoutes(app);
setupGalleryRoutes(app);
setupEventsRoutes(app);
setupWorkshopsRoutes(app);
setupArtistsRoutes(app);
setupBlogsRoutes(app);
setupContactRoutes(app);
setupTicketsRoutes(app);
setupHeroBannersRoutes(app);
setupAdminRoutes(app);
setupUploadRoutes(app);
setupImageRoutes(app);
setupDebugRoutes(app);
app.get("/api/info", (c) => {
  return c.json({
    success: true,
    message: "Kalakritam API Information",
    version: "2.0.0",
    environment: c.env?.NODE_ENV || "production",
    endpoints: {
      auth: "/auth/*",
      userAuth: "/api/auth/* (signup, login, google, me, profile)",
      adminUsers: "/api/admin/users (GET, DELETE)",
      gallery: "/gallery/*",
      events: "/events/*",
      workshops: "/workshops/*",
      artists: "/artists/*",
      blogs: "/blogs/*",
      contact: "/contact/*",
      tickets: "/tickets/*",
      admin: "/admin/*",
       upload: "/upload/*",
      images: "/images/*",
      debug: "/debug/*"
    }
  });
});
app.get("*", (c) => {
  return c.json({
    success: false,
    message: "API endpoint not found",
    requestedUrl: c.req.url,
    method: c.req.method,
    suggestion: "Visit /api/info for available endpoints"
  }, 404);
});
var src_default = app;
var worker_default = src_default;
export {
  worker_default as default
};
//# sourceMappingURL=KALAKRITAM_PRODUCTION_NO_SAMPLE_DATA.js.map
