'use strict';

/*
 * Lightweight offline UI localization for ApkStart.
 * Chinese remains the source language; English and Persian are selected locally
 * and the preference is stored in localStorage.
 */
(() => {
  const dictionaries = {
    en: {
      '未连接运行时':'Runtime disconnected','设置':'Settings','搜索已安装应用':'Search installed apps',
      '安装 APK':'Install APK','把 APK 拖进来就能装':'Drop APK files here to install',
      '安装完成后会自动生成桌面图标，双击即以独立窗口运行，和普通 Windows 软件一样。':'A desktop shortcut is created after installation. Double-click it to run the app in its own window, just like a regular Windows application.',
      '已注册 .apk 关联时，在资源管理器里双击 APK 也会直接装到 ApkStart。':'When .apk file association is enabled, double-clicking an APK in File Explorer installs it directly into ApkStart.',
      '选择 APK 文件':'Choose APK files','正在检查运行时…':'Checking runtime…','你好':'Hello',
      'ApkStart 已就绪':'ApkStart is ready','下次启动不再自动弹出':'Do not show automatically next time',
      '打开设置':'Open settings','开始使用':'Get started','松手开始安装':'Release to start installation',
      '支持单个或多个 .apk 文件':'One or multiple .apk files supported','运行时与环境':'Runtime & Environment',
      '运行状态':'Runtime status','正在检查…':'Checking…','一键完成':'Set up automatically',
      '高级：连接已有运行时':'Advanced: connect an existing runtime','全自动：无需选择镜像、无需启用加速、无需调内存':'Fully automatic: no image selection, acceleration setup, or memory tuning required',
      '安装 Android 到虚拟磁盘':'Install Android to the virtual disk','设置修改后立即生效':'Settings take effect immediately',
      '完成':'Done','自动模式（默认，无需设置）':'Automatic mode (default)','本机自适应参数':'Adaptive system settings',
      '正在检测…':'Detecting…','应用窗口':'App window','显示模式':'Display mode',
      '竖屏窗口（可自由拉伸，记住每个应用的大小）':'Portrait window (resizable; remembers each app size)',
      '全屏（铺满屏幕，保持手机比例两侧留黑）':'Fullscreen (fills the screen while preserving phone aspect ratio)',
      '竖屏画面大小':'Portrait resolution','鼠标键位':'Mouse controls','左键 · 确认 / 点击':'Left button · Confirm / Click',
      '右键 · 安卓返回':'Right button · Android Back','滚轮 · 滑动':'Wheel · Scroll',
      '性能与资源占用':'Performance & Resources','资源策略':'Resource profile','下载与更新源':'Downloads & Update Sources',
      '更新与下载源':'Update source','关于':'About','软件更新':'Software update','检查更新':'Check for updates',
      '立即更新':'Update now','当前版本':'Current version','文件互通':'File sharing','系统集成':'System integration',
      '桌面与应用':'Desktop & Apps','安装后自动创建桌面快捷方式':'Create desktop shortcuts after installation',
      '同时添加到开始菜单':'Also add to Start menu','快捷方式目录':'Shortcut directory','本机共享目录':'Local shared folder',
      '安卓内对应目录':'Matching Android directory','浏览':'Browse','打开':'Open','立即同步':'Sync now',
      '保存并迁移':'Save and migrate','关联 .apk 文件':'Associate .apk files','卸载 ApkStart':'Uninstall ApkStart',
      '一键卸载':'Uninstall','安卓原生设置':'Native Android settings','显示设置':'Display settings',
      '声音设置':'Sound settings','语言设置':'Language settings','应用管理':'App management',
      'English':'English','فارسی':'فارسی','中文':'中文','Language':'زبان','双击即装的 Windows 安卓应用启动器：APK 安装、桌面快捷方式、独立窗口运行、文件双向互通。':'اجراکننده برنامه‌های اندروید در ویندوز: نصب APK، ساخت میان‌بر دسکتاپ، اجرای مستقل برنامه‌ها و همگام‌سازی دوطرفه فایل‌ها.','Language':'Language','双击即装的 Windows 安卓应用启动器：APK 安装、桌面快捷方式、独立窗口运行、文件双向互通。':'A Windows Android app launcher: install APKs, create desktop shortcuts, run apps in separate windows, and sync files both ways.'
    },
    fa: {
      '未连接运行时':'محیط اجرا متصل نیست','设置':'تنظیمات','搜索已安装应用':'جست‌وجوی برنامه‌های نصب‌شده',
      '安装 APK':'نصب APK','把 APK 拖进来就能装':'برای نصب، فایل APK را اینجا رها کنید',
      '安装完成后会自动生成桌面图标，双击即以独立窗口运行，和普通 Windows 软件一样。':'پس از نصب، میان‌بر برنامه روی دسکتاپ ساخته می‌شود. با دوبار کلیک، برنامه در پنجره‌ای مستقل اجرا خواهد شد.',
      '已注册 .apk 关联时，在资源管理器里双击 APK 也会直接装到 ApkStart。':'اگر پسوند ‎.apk‎ به برنامه متصل باشد، با دوبار کلیک روی فایل در File Explorer مستقیماً در ApkStart نصب می‌شود.',
      '选择 APK 文件':'انتخاب فایل APK','正在检查运行时…':'در حال بررسی محیط اجرا…','你好':'سلام',
      'ApkStart 已就绪':'ApkStart آماده است','下次启动不再自动弹出':'دفعه بعد به‌صورت خودکار نمایش داده نشود',
      '打开设置':'باز کردن تنظیمات','开始使用':'شروع','松手开始安装':'برای شروع نصب رها کنید',
      '支持单个或多个 .apk 文件':'پشتیبانی از یک یا چند فایل ‎.apk‎','运行时与环境':'محیط اجرا و تنظیمات',
      '运行状态':'وضعیت اجرا','正在检查…':'در حال بررسی…','一键完成':'راه‌اندازی خودکار',
      '高级：连接已有运行时':'پیشرفته: اتصال به محیط اجرای موجود','全自动：无需选择镜像、无需启用加速、无需调内存':'کاملاً خودکار؛ نیازی به انتخاب ایمیج، فعال‌سازی شتاب‌دهنده یا تنظیم حافظه نیست',
      '安装 Android 到虚拟磁盘':'نصب اندروید روی دیسک مجازی','设置修改后立即生效':'تغییرات تنظیمات بلافاصله اعمال می‌شوند',
      '完成':'انجام شد','自动模式（默认，无需设置）':'حالت خودکار (پیش‌فرض)','本机自适应参数':'تنظیمات سازگار با سیستم',
      '正在检测…':'در حال شناسایی…','应用窗口':'پنجره برنامه','显示模式':'حالت نمایش',
      '竖屏窗口（可自由拉伸，记住每个应用的大小）':'پنجره عمودی (با قابلیت تغییر اندازه و ذخیره اندازه هر برنامه)',
      '全屏（铺满屏幕，保持手机比例两侧留黑）':'تمام‌صفحه (با حفظ نسبت تصویر گوشی)',
      '竖屏画面大小':'اندازه تصویر عمودی','鼠标键位':'تنظیمات ماوس','左键 · 确认 / 点击':'کلیک چپ · تأیید / کلیک',
      '右键 · 安卓返回':'کلیک راست · بازگشت اندروید','滚轮 · 滑动':'چرخ ماوس · پیمایش',
      '性能与资源占用':'عملکرد و مصرف منابع','资源策略':'حالت مصرف منابع','下载与更新源':'منابع دانلود و به‌روزرسانی',
      '更新与下载源':'منبع به‌روزرسانی','关于':'درباره','软件更新':'به‌روزرسانی نرم‌افزار','检查更新':'بررسی به‌روزرسانی',
      '立即更新':'به‌روزرسانی اکنون','当前版本':'نسخه فعلی','文件互通':'اشتراک‌گذاری فایل','系统集成':'یکپارچه‌سازی سیستم',
      '桌面与应用':'دسکتاپ و برنامه‌ها','安装后自动创建桌面快捷方式':'ساخت خودکار میان‌بر دسکتاپ پس از نصب',
      '同时添加到开始菜单':'افزودن به منوی Start','快捷方式目录':'مسیر میان‌برها','本机共享目录':'پوشه اشتراکی رایانه',
      '安卓内对应目录':'پوشه متناظر در اندروید','浏览':'مرور','打开':'باز کردن','立即同步':'همگام‌سازی',
      '保存并迁移':'ذخیره و انتقال','关联 .apk 文件':'اتصال فایل‌های ‎.apk‎','卸载 ApkStart':'حذف ApkStart',
      '一键卸载':'حذف با یک کلیک','安卓原生设置':'تنظیمات اصلی اندروید','显示设置':'تنظیمات نمایش',
      '声音设置':'تنظیمات صدا','语言设置':'تنظیمات زبان اندروید','应用管理':'مدیریت برنامه‌ها',
      'English':'English','فارسی':'فارسی','中文':'中文'
    }
  };


  const runtimeTranslations = {
    en: {
      '正在运行':'Running','运行中':'Running','切换到前台':'Bring to front','暂无应用':'No apps yet',
      '运行时未部署 —— 打开设置 → 运行时，一键完成':'Runtime not deployed — open Settings → Runtime and select Set up automatically',
      '需要部署':'Deployment required','引导中':'Guided setup','软件模拟':'Software rendering',
      '待下载镜像':'Image download pending','运行时引擎未安装 —— 打开设置 → 运行时一键完成':'Runtime engine not installed — open Settings and complete automatic setup',
      '运行时已就绪 —— 安装 APK 或双击桌面图标会自动开机':'Runtime ready — install an APK or double-click a desktop shortcut to start',
      '待开机':'Not started','安装中':'Installing','待安装':'Waiting for installation','一切就绪':'All ready',
      '准备中…':'Preparing…','准备失败':'Setup failed','请检查网络后重试':'Check your network and try again',
      '运行时已就绪':'Runtime ready','开机未完成':'Startup incomplete','未知错误':'Unknown error',
      '已有安装任务在进行':'An installation is already in progress','请等当前应用装完再继续。':'Wait for the current app to finish installing.',
      '桌面快捷方式已创建，双击即可直接打开。':'Desktop shortcut created. Double-click to open.',
      '创建快捷方式失败':'Failed to create shortcut','已卸载':'Uninstalled','卸载失败':'Uninstall failed',
      '打开应用':'Open app','创建桌面快捷方式':'Create desktop shortcut','固定到顶部':'Pin to top',
      '打开 APK 所在位置':'Open APK location','清除应用数据':'Clear app data','取消固定':'Unpin',
      '数据已清除':'App data cleared','清除失败':'Failed to clear data','读取中…':'Reading…',
      '运行时未启动':'Runtime is not running','Wi-Fi 已开':'Wi-Fi on','Wi-Fi 已关':'Wi-Fi off',
      '已生效':'Applied','运行时未就绪':'Runtime not ready','Wi-Fi 已开启':'Wi-Fi enabled',
      'Wi-Fi 已关闭':'Wi-Fi disabled','已进入飞行模式':'Airplane mode enabled','已退出飞行模式':'Airplane mode disabled',
      '系统动画已开启':'System animations enabled','系统动画已关闭，界面更快':'System animations disabled for a faster interface',
      '字体大小已调整':'Font size updated','显示大小已调整':'Display size updated','音量已调整':'Volume updated',
      '优化失败，运行时可能未启动':'Optimization failed; the runtime may not be running',
      '需要先打开一次应用，让运行时启动':'Open an app once to start the runtime',
      '读取数据分区信息失败':'Failed to read data partition information','尚未创建':'Not created',
      '统计不可用':'Statistics unavailable','网络不可用':'Network unavailable','打开下载页':'Open download page',
      '立即更新':'Update now','更新失败':'Update failed','正在更新…':'Updating…','检查中…':'Checking…',
      '正在连接 GitHub…':'Connecting to GitHub…','已是最新版本':'Already up to date','检查失败':'Check failed',
      '更新中…':'Updating…','资源策略已切换':'Resource profile changed','下一次打开应用生效':'Takes effect next time you open an app',
      '先选一个容量':'Choose a capacity first','开始扩容':'Start expanding','扩容中…':'Expanding…',
      '数据分区已扩容':'Data partition expanded','扩容失败':'Expansion failed','已恢复系统组件':'System components restored',
      '重启运行时后生效':'Takes effect after restarting the runtime','已切全屏':'Switched to fullscreen',
      '已切竖屏窗口':'Switched to portrait window','画面大小已更新':'Display size updated',
      '已补齐快捷方式':'Shortcuts recreated','快捷方式都还在':'All shortcuts are present',
      '桌面与开始菜单入口正常':'Desktop and Start menu shortcuts are OK','诊断报告已导出':'Diagnostic report exported',
      '导出失败':'Export failed','已经是精简状态':'Already optimized','清理完成':'Cleanup complete',
      '清理失败':'Cleanup failed','重置失败':'Reset failed','请重试':'Please try again',
      '安卓数据已重置':'Android data reset','开始修复':'Start repair','网络仍未恢复':'Network not restored',
      '网络已恢复':'Network restored','已联网':'Connected','修复失败':'Repair failed','扫描失败':'Scan failed',
      '安装完成':'Installation complete','安装失败':'Installation failed','已启动':'Launched','启动失败':'Launch failed',
      '已固定':'Pinned','已取消固定':'Unpinned','正在打开':'Opening','正在安装':'Installing'
    },
    fa: {
      '正在运行':'در حال اجرا','运行中':'در حال اجرا','切换到前台':'انتقال به پنجره فعال','暂无应用':'هنوز برنامه‌ای وجود ندارد',
      '运行时未部署 —— 打开设置 → 运行时，一键完成':'محیط اجرا نصب نشده است؛ از تنظیمات ← محیط اجرا، راه‌اندازی خودکار را اجرا کنید',
      '需要部署':'نیازمند راه‌اندازی','引导中':'در حال راهنمایی','软件模拟':'پردازش نرم‌افزاری',
      '待下载镜像':'در انتظار دانلود ایمیج','运行时引擎未安装 —— 打开设置 → 运行时一键完成':'موتور اجرا نصب نیست؛ از تنظیمات، راه‌اندازی خودکار را انجام دهید',
      '运行时已就绪 —— 安装 APK 或双击桌面图标会自动开机':'محیط اجرا آماده است؛ با نصب APK یا دوبار کلیک روی میان‌بر، اجرا آغاز می‌شود',
      '待开机':'در انتظار شروع','安装中':'در حال نصب','待安装':'در انتظار نصب','一切就绪':'همه‌چیز آماده است',
      '准备中…':'در حال آماده‌سازی…','准备失败':'آماده‌سازی ناموفق بود','请检查网络后重试':'اتصال اینترنت را بررسی و دوباره تلاش کنید',
      '运行时已就绪':'محیط اجرا آماده است','开机未完成':'راه‌اندازی کامل نشد','未知错误':'خطای نامشخص',
      '已有安装任务在进行':'یک فرایند نصب دیگر در حال انجام است','请等当前应用装完再继续。':'تا پایان نصب برنامه فعلی صبر کنید.',
      '桌面快捷方式已创建，双击即可直接打开。':'میان‌بر دسکتاپ ساخته شد؛ برای اجرا دوبار کلیک کنید.',
      '创建快捷方式失败':'ساخت میان‌بر ناموفق بود','已卸载':'حذف شد','卸载失败':'حذف ناموفق بود',
      '打开应用':'باز کردن برنامه','创建桌面快捷方式':'ساخت میان‌بر دسکتاپ','固定到顶部':'سنجاق‌کردن در بالا',
      '打开 APK 所在位置':'باز کردن محل فایل APK','清除应用数据':'پاک‌کردن داده‌های برنامه','取消固定':'برداشتن سنجاق',
      '数据已清除':'داده‌های برنامه پاک شد','清除失败':'پاک‌سازی ناموفق بود','读取中…':'در حال خواندن…',
      '运行时未启动':'محیط اجرا آغاز نشده است','Wi-Fi 已开':'وای‌فای روشن است','Wi-Fi 已关':'وای‌فای خاموش است',
      '已生效':'اعمال شد','运行时未就绪':'محیط اجرا آماده نیست','Wi-Fi 已开启':'وای‌فای فعال شد',
      'Wi-Fi 已关闭':'وای‌فای غیرفعال شد','已进入飞行模式':'حالت پرواز فعال شد','已退出飞行模式':'حالت پرواز غیرفعال شد',
      '系统动画已开启':'پویانمایی سیستم فعال شد','系统动画已关闭，界面更快':'پویانمایی سیستم غیرفعال شد؛ رابط سریع‌تر است',
      '字体大小已调整':'اندازه قلم تغییر کرد','显示大小已调整':'اندازه نمایش تغییر کرد','音量已调整':'بلندی صدا تغییر کرد',
      '优化失败，运行时可能未启动':'بهینه‌سازی ناموفق بود؛ شاید محیط اجرا فعال نیست',
      '需要先打开一次应用，让运行时启动':'برای آغاز محیط اجرا، ابتدا یک برنامه را باز کنید',
      '读取数据分区信息失败':'خواندن اطلاعات پارتیشن داده ناموفق بود','尚未创建':'هنوز ساخته نشده',
      '统计不可用':'آمار در دسترس نیست','网络不可用':'شبکه در دسترس نیست','打开下载页':'باز کردن صفحه دانلود',
      '更新失败':'به‌روزرسانی ناموفق بود','正在更新…':'در حال به‌روزرسانی…','检查中…':'در حال بررسی…',
      '正在连接 GitHub…':'در حال اتصال به GitHub…','已是最新版本':'آخرین نسخه نصب است','检查失败':'بررسی ناموفق بود',
      '更新中…':'در حال به‌روزرسانی…','资源策略已切换':'حالت مصرف منابع تغییر کرد','下一次打开应用生效':'از اجرای بعدی برنامه اعمال می‌شود',
      '先选一个容量':'ابتدا ظرفیت را انتخاب کنید','开始扩容':'شروع افزایش ظرفیت','扩容中…':'در حال افزایش ظرفیت…',
      '数据分区已扩容':'ظرفیت پارتیشن داده افزایش یافت','扩容失败':'افزایش ظرفیت ناموفق بود','已恢复系统组件':'اجزای سیستم بازیابی شدند',
      '重启运行时后生效':'پس از راه‌اندازی مجدد محیط اجرا اعمال می‌شود','已切全屏':'حالت تمام‌صفحه فعال شد',
      '已切竖屏窗口':'حالت پنجره عمودی فعال شد','画面大小已更新':'اندازه تصویر به‌روز شد',
      '已补齐快捷方式':'میان‌برها بازسازی شدند','快捷方式都还在':'همه میان‌برها موجودند',
      '桌面与开始菜单入口正常':'میان‌برهای دسکتاپ و منوی Start درست هستند','诊断报告已导出':'گزارش عیب‌یابی صادر شد',
      '导出失败':'صدور گزارش ناموفق بود','已经是精简状态':'از قبل بهینه شده است','清理完成':'پاک‌سازی کامل شد',
      '清理失败':'پاک‌سازی ناموفق بود','重置失败':'بازنشانی ناموفق بود','请重试':'دوباره تلاش کنید',
      '安卓数据已重置':'داده‌های اندروید بازنشانی شد','开始修复':'شروع تعمیر','网络仍未恢复':'شبکه هنوز وصل نشده است',
      '网络已恢复':'شبکه بازیابی شد','已联网':'متصل شد','修复失败':'تعمیر ناموفق بود','扫描失败':'اسکن ناموفق بود',
      '安装完成':'نصب کامل شد','安装失败':'نصب ناموفق بود','已启动':'اجرا شد','启动失败':'اجرا ناموفق بود',
      '已固定':'سنجاق شد','已取消固定':'سنجاق برداشته شد','正在打开':'در حال باز کردن','正在安装':'در حال نصب'
    }
  };
  Object.assign(dictionaries.en, runtimeTranslations.en);
  Object.assign(dictionaries.fa, runtimeTranslations.fa);

  const original = new WeakMap();
  function translateTextNode(node, lang) {
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;
    let record = original.get(node);
    if (!record) {
      record = { source: raw, translated: null };
      original.set(node, record);
    } else if (record.translated !== null && raw !== record.translated) {
      // The app updated this text node dynamically; treat the new text as its source.
      record.source = raw;
      record.translated = null;
    }
    const source = record.source;
    const key = source.trim();
    const translated = dictionaries[lang] && dictionaries[lang][key];
    if (translated) {
      const next = source.replace(key, translated);
      node.nodeValue = next;
      record.translated = next;
    } else {
      node.nodeValue = source;
      record.translated = null;
    }
  }
  function apply(lang) {
    const language = ['zh', 'en', 'fa'].includes(lang) ? lang : 'zh';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.body.classList.toggle('locale-fa', language === 'fa');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (language === 'zh') {
        if (original.has(node)) node.nodeValue = original.get(node).source;
      } else translateTextNode(node, language);
    }
    document.querySelectorAll('[placeholder],[title],[aria-label]').forEach((el) => {
      ['placeholder', 'title', 'aria-label'].forEach((attr) => {
        const value = el.getAttribute(attr);
        if (!value) return;
        const key = 'attr:' + attr;
        if (!el.dataset[key.replace(':','')]) el.dataset[key.replace(':','')] = value;
        const source = el.dataset[key.replace(':','')];
        const translated = dictionaries[language] && dictionaries[language][source];
        if (translated) el.setAttribute(attr, translated);
        else if (language === 'zh') el.setAttribute(attr, source);
      });
    });
    const picker = document.getElementById('languagePicker');
    if (picker && picker.value !== language) picker.value = language;
    localStorage.setItem('apkstart-language', language);
  }

  function init() {
    const picker = document.getElementById('languagePicker');
    const saved = localStorage.getItem('apkstart-language') || 'zh';
    if (picker) picker.addEventListener('change', () => apply(picker.value));
    apply(saved);
    const observer = new MutationObserver(() => {
      const lang = localStorage.getItem('apkstart-language') || 'zh';
      if (lang === 'zh') return;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) translateTextNode(node, lang);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.ApkStartI18n = { apply };
})();
