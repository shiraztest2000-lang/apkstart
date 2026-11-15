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
      'English':'English','فارسی':'فارسی','中文':'中文'
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

  const original = new WeakMap();
  function translateTextNode(node, lang) {
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;
    if (!original.has(node)) original.set(node, raw);
    const source = original.get(node);
    const key = source.trim();
    const translated = dictionaries[lang] && dictionaries[lang][key];
    if (translated) node.nodeValue = source.replace(key, translated);
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
        if (original.has(node)) node.nodeValue = original.get(node);
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
