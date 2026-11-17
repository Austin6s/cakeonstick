// Everything the page does in the browser. The page reads fine without it; this adds
// the language memory, the menu, ordering by LINE / Instagram / email, the dialog,
// carousels and the contact form.
//
// How a message reaches each app (the same rules for quick order and the contact form):
//   LINE on a phone     the chat opens with the message typed in (line.me/R/oaMessage).
//   LINE on a computer  that web link only reaches LINE's home page there, so the message
//                       is copied and the LINE desktop app is opened (line://). If the app
//                       doesn't open, the add-friend page with the QR code opens instead.
//   Instagram           a DM can't be pre-filled: the message is copied and the DM opens.
//   Email               mailto: opens the visitor's default mail app, pre-filled.
// The message is always shown with a Copy button, so nothing is lost if an app or a new
// tab does not open.

const all = <T extends Element>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

/** Phones and tablets, where LINE opens a chat with the message typed in. */
const isPhone =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  // iPadOS calls itself a Mac; a Mac with a touch screen is an iPad.
  (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

/**
 * Copies `text`. The copy itself happens straight away, inside the tap, so it still
 * works when a new tab is opened on the next line. Resolves to whether it worked.
 * `near` must be inside the open dialog when there is one: the rest of the page is
 * inert while a dialog is open.
 *
 * It uses document.execCommand('copy'), which is marked deprecated, on purpose: it is
 * the only copy that finishes before the next line runs. navigator.clipboard is
 * asynchronous and fails once the new tab has taken the focus, so it is only the fallback.
 */
function copyText(text: string, near: HTMLElement = document.body): Promise<boolean> {
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const box = document.createElement('textarea');
  box.value = text;
  box.readOnly = true;
  box.setAttribute('aria-hidden', 'true');
  // 16px stops iOS zooming in on it; fixed and transparent keeps the page still.
  box.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;font-size:16px;';
  near.appendChild(box);
  box.focus({ preventScroll: true });
  box.select();
  box.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  box.remove();
  focused?.focus({ preventScroll: true });
  if (ok) return Promise.resolve(true);
  if (!navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false,
  );
}

/** Opens `url` in a new tab. False when a pop-up blocker stopped it. */
function openTab(url: string): boolean {
  const tab = window.open(url, '_blank');
  if (!tab) return false;
  try {
    tab.opener = null; // the new page gets no handle on this one
  } catch {
    // Already on another site: nothing to do.
  }
  return true;
}

/** How long to wait for the LINE desktop app before deciding it isn't installed. */
const LINE_APP_WAIT_MS = 1500;

/**
 * Computers only: opens the LINE desktop app at `appUrl` (a line:// address). If this
 * page still has the focus after a moment, the app didn't open (most likely it isn't
 * installed), so the add-friend QR page `qrUrl` opens in a new tab instead.
 * `done` hears 'app' (LINE took over), 'qr' (the QR page opened) or 'blocked' (a pop-up
 * blocker stopped the QR page). Must be called inside the visitor's tap.
 */
function openLineApp(appUrl: string, qrUrl: string, near: HTMLElement, done: (result: 'app' | 'qr' | 'blocked') => void) {
  let left = false;
  const leave = () => {
    left = true;
  };
  // Opening the app (or the browser's "Open LINE?" prompt) takes the focus from the page.
  window.addEventListener('blur', leave);
  document.addEventListener('visibilitychange', leave);

  // A link click, not location.href: a browser that can't open line:// then stays here.
  const link = document.createElement('a');
  link.href = appUrl;
  link.hidden = true;
  near.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    window.removeEventListener('blur', leave);
    document.removeEventListener('visibilitychange', leave);
    if (left || document.hidden) return done('app');
    done(openTab(qrUrl) ? 'qr' : 'blocked');
  }, LINE_APP_WAIT_MS);
}

/** A Copy button: copies, shows "Copied" for two seconds, or says it could not. */
function wireCopyButton(button: HTMLButtonElement, getText: () => string, near: HTMLElement, onFail: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  button.addEventListener('click', () => {
    void copyText(getText(), near).then((ok) => {
      if (!ok) return onFail();
      button.textContent = button.dataset.labelDone ?? '';
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.textContent = button.dataset.label ?? '';
      }, 2000);
    });
  });
}

// ---------- Language: remember the visitor's choice, keep their place on the page ----------
for (const link of all<HTMLAnchorElement>('[data-lang]')) {
  link.addEventListener('click', () => {
    try {
      localStorage.setItem('cos-lang', link.dataset.lang ?? 'zh');
    } catch {
      // Private mode: the choice just isn't remembered.
    }
    link.href = link.href.split('#')[0] + location.hash;
  });
}

// ---------- LINE add-friend buttons: on a computer, try the desktop app first ----------
if (!isPhone) {
  for (const link of all<HTMLAnchorElement>('[data-line-add]')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const qrUrl = link.href;
      const appUrl = 'line://' + new URL(qrUrl).pathname.replace(/^\/R\//, '');
      openLineApp(appUrl, qrUrl, document.body, (result) => {
        // No tab could open: show the QR page here instead.
        if (result === 'blocked') window.location.href = qrUrl;
      });
    });
  }
}

// ---------- Mobile menu ----------
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const mobileNav = document.getElementById('mobile-nav');

function setMenuOpen(open: boolean) {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', (open ? menuButton.dataset.labelClose : menuButton.dataset.labelOpen) ?? '');
  menuButton.textContent = open ? '✕' : '☰';
}
menuButton?.addEventListener('click', () => setMenuOpen(mobileNav?.hidden !== false));
mobileNav?.addEventListener('click', (event) => {
  if ((event.target as Element).closest('a')) setMenuOpen(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
    setMenuOpen(false);
    menuButton?.focus();
  }
});

// ---------- Opening a quick-order dialog ----------
document.addEventListener('click', (event) => {
  const opener = (event.target as Element).closest<HTMLElement>('[data-order], [data-order-media]');
  const orderId = opener?.dataset.order ?? opener?.dataset.orderMedia;
  if (!orderId) return;
  const dialog = document.getElementById('order-' + orderId);
  if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
});

// ---------- Quick-order dialogs ----------
for (const dialog of all<HTMLDialogElement>('dialog.order')) {
  const message = dialog.dataset.message ?? '';
  const status = dialog.querySelector<HTMLElement>('[data-status]');
  const say = (text: string | undefined) => {
    if (status) status.textContent = text ?? '';
  };
  const sayCopyFailed = () => say(status?.dataset.copyFailed);

  // A click on the backdrop lands on the dialog element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => say(''));

  const copyButton = dialog.querySelector<HTMLButtonElement>('[data-copy]');
  if (copyButton) wireCopyButton(copyButton, () => message, dialog, sayCopyFailed);

  // LINE on a computer: copy the message, open the desktop app, or else the QR page.
  const lineLink = dialog.querySelector<HTMLAnchorElement>('[data-line-message]');
  const qrLink = dialog.querySelector<HTMLAnchorElement>('[data-line-qr]');
  if (lineLink && !isPhone) {
    const ld = lineLink.dataset;
    lineLink.href = ld.addUrl ?? lineLink.href; // what a middle click or new tab gets
    lineLink.addEventListener('click', (event) => {
      event.preventDefault();
      void copyText(message, dialog).then((ok) => say(ok ? ld.desktop : status?.dataset.copyFailed));
      if (qrLink) qrLink.hidden = false; // the way out if neither the app nor the QR page shows
      openLineApp(ld.appUrl ?? '', ld.addUrl ?? '', dialog, (result) => {
        if (result === 'qr') say(ld.qrOpened);
        if (result === 'blocked') say(ld.blocked);
      });
    });
  }
  dialog.addEventListener('close', () => {
    if (qrLink) qrLink.hidden = true;
  });

  // "Copy first" links copy the message as they open (Instagram).
  for (const link of all<HTMLAnchorElement>('[data-copy-first]', dialog)) {
    link.addEventListener('click', () => {
      void copyText(message, dialog).then((ok) => (ok ? say(link.dataset.copied) : sayCopyFailed()));
    });
  }
}

// ---------- Photo carousels ----------
for (const media of all<HTMLElement>('[data-carousel]')) {
  const track = media.querySelector<HTMLElement>('[data-carousel-track]');
  const dots = all<HTMLButtonElement>('[data-carousel-dot]', media);
  if (!track || dots.length === 0) continue;
  const count = dots.length;
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (index: number) => track.scrollTo({ left: ((index + count) % count) * track.clientWidth });

  media.querySelector('[data-carousel-prev]')?.addEventListener('click', () => go(current() - 1));
  media.querySelector('[data-carousel-next]')?.addEventListener('click', () => go(current() + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  track.addEventListener(
    'scroll',
    () => {
      const now = current();
      dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === now)));
    },
    { passive: true },
  );
}

// ---------- Contact form ----------
const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const d = form.dataset;
  const errorEl = form.querySelector<HTMLElement>('[data-form-error]');
  const result = form.querySelector<HTMLElement>('[data-form-result]');
  const statusEl = form.querySelector<HTMLElement>('[data-form-success]');
  const messageEl = form.querySelector<HTMLElement>('[data-form-message]');
  const openLink = form.querySelector<HTMLAnchorElement>('[data-form-open]');
  const copyButton = form.querySelector<HTMLButtonElement>('[data-form-copy]');
  const input = (name: string) => form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  let text = '';

  form.noValidate = true; // the page shows its own message instead of the browser's bubbles

  // The event date can't be in the past.
  const dateInput = input('date');
  if (dateInput) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    dateInput.setAttribute('min', `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  }

  if (copyButton && statusEl) {
    wireCopyButton(copyButton, () => text, form, () => {
      statusEl.textContent = d.copyFailed ?? '';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (name: string) => (input(name)?.value ?? '').trim();
    const name = value('name');
    const email = value('email');
    const date = value('date');
    const message = value('message');

    const nameOk = name !== '';
    const emailOk = emailPattern.test(email);
    input('name')?.setAttribute('aria-invalid', String(!nameOk));
    input('email')?.setAttribute('aria-invalid', String(!emailOk));
    if (!nameOk || !emailOk) {
      if (errorEl) errorEl.hidden = false;
      if (result) result.hidden = true;
      input(nameOk ? 'email' : 'name')?.focus();
      return;
    }

    const subject = (d.subjectPrefix ?? '') + name;
    const lines = [(d.nameLine ?? '') + name, 'Email: ' + email];
    if (date) lines.push((d.dateLine ?? '') + date);
    lines.push('', message || (d.noDetails ?? ''));
    const body = lines.join('\n');
    // In a chat the heading is just "Custom order request"; the name is on the next line.
    text = (d.subjectPrefix ?? '').replace(/[\s—-]+$/, '') + '\n' + body;

    // Where to go, whether the message has to be copied first, and what to say.
    const via = (event.submitter as HTMLElement | null)?.dataset.via ?? 'line';
    let url: string;
    let copyFirst = false;
    let success: string | undefined;
    let openLabel: string | undefined;
    if (via === 'email') {
      url = 'mailto:' + (d.email ?? '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      success = d.successEmail;
      openLabel = d.openEmail;
    } else if (via === 'instagram') {
      url = d.igUrl ?? '';
      copyFirst = true;
      success = d.successIg;
      openLabel = d.openIg;
    } else if (isPhone) {
      url = (d.lineMessageUrl ?? '') + encodeURIComponent(text);
      success = d.successLine;
      openLabel = d.openLine;
    } else {
      // A computer: the desktop app, or else the QR page (see openLineApp).
      url = d.lineAddUrl ?? '';
      copyFirst = true;
      success = d.successLineDesktop;
      openLabel = d.lineQrLink;
    }
    const lineApp = via === 'line' && !isPhone;

    // Copy first (while this page still has the focus), then open the app.
    const copied = copyFirst ? copyText(text, form) : Promise.resolve(true);
    let opened = true;
    if (via === 'email') window.location.href = url;
    else if (lineApp) {
      openLineApp((d.lineAppUrl ?? '') + encodeURIComponent(text), url, form, (outcome) => {
        if (!statusEl || outcome === 'app') return;
        statusEl.textContent = outcome === 'qr' ? (d.lineQrOpened ?? '') : (d.blocked ?? '');
      });
    } else opened = openTab(url);

    if (errorEl) errorEl.hidden = true;
    if (messageEl) messageEl.textContent = text;
    if (openLink) {
      openLink.href = url;
      openLink.textContent = openLabel ?? '';
      // A mail link stays in this tab; the others open a new one.
      if (via === 'email') openLink.removeAttribute('target');
      else openLink.target = '_blank';
    }
    void copied.then((ok) => {
      // Blocked: say so and point at the link below, rather than "it should have opened".
      const parts = opened ? [ok ? success : d.copyFailed] : [d.blocked, ok ? undefined : d.copyFailed];
      if (statusEl) statusEl.textContent = parts.filter(Boolean).join(' ');
      if (result) result.hidden = false;
    });
  });
}
