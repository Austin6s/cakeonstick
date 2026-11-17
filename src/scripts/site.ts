// Everything the page does in the browser. The page reads fine without it; this adds
// the language memory, the menu, LINE/Instagram ordering, the dialog, carousels and the form.

const all = <T extends Element>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

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

// ---------- LINE ----------
const isMobileDevice = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/** Opens LINE at `path` (for example "ti/p/@id" or "oaMessage/@id/?text"). */
function openLineUri(path: string) {
  if (isMobileDevice()) {
    window.open('https://line.me/R/' + path, '_blank', 'noopener');
    return;
  }
  // Desktop: try the LINE desktop app first, fall back to the web link.
  window.location.href = 'line://' + path;
  setTimeout(() => {
    if (!document.hidden) window.open('https://line.me/R/' + path, '_blank', 'noopener');
  }, 1500);
}

const copyText = (text: string) => {
  navigator.clipboard?.writeText(text).catch(() => {});
};

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

// ---------- Clicks handled anywhere on the page ----------
document.addEventListener('click', (event) => {
  const target = event.target as Element;

  const line = target.closest<HTMLElement>('[data-line]');
  if (line?.dataset.line) {
    event.preventDefault();
    openLineUri(line.dataset.line);
    return;
  }

  const opener = target.closest<HTMLElement>('[data-order], [data-order-media]');
  const orderId = opener?.dataset.order ?? opener?.dataset.orderMedia;
  if (orderId) {
    const dialog = document.getElementById('order-' + orderId);
    if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
  }
});

// ---------- Quick-order dialogs ----------
for (const dialog of all<HTMLDialogElement>('dialog.order')) {
  const message = dialog.dataset.message ?? '';
  const copied = dialog.querySelector<HTMLElement>('[data-copied]');
  const copyButton = dialog.querySelector<HTMLButtonElement>('[data-copy]');
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  // A click on the backdrop lands on the dialog element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (copied) copied.textContent = '';
  });

  copyButton?.addEventListener('click', () => {
    copyText(message);
    copyButton.textContent = copyButton.dataset.labelDone ?? '';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyButton.textContent = copyButton.dataset.label ?? '';
    }, 2000);
  });

  // Instagram can't be pre-filled: copy the message, then the link opens the DM.
  dialog.querySelector('[data-order-ig]')?.addEventListener('click', () => {
    copyText(message);
    if (copied) copied.textContent = copied.dataset.text ?? '';
  });
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

// ---------- Contact form: write the message, hand it to LINE, Instagram or the mail app ----------
const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const errorEl = form.querySelector<HTMLElement>('[data-form-error]');
  const successEl = form.querySelector<HTMLElement>('[data-form-success]');
  const d = form.dataset;
  form.noValidate = true; // the page shows its own message instead of the browser's bubbles

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    const name = field('name');
    const email = field('email');
    const date = field('date');
    const message = field('message');

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      if (errorEl) errorEl.hidden = false;
      if (successEl) successEl.hidden = true;
      return;
    }

    const subject = (d.subjectPrefix ?? '') + name;
    const lines = [(d.nameLine ?? '') + name, 'Email: ' + email];
    if (date) lines.push((d.dateLine ?? '') + date);
    lines.push('', message || (d.noDetails ?? ''));
    const body = lines.join('\n');

    const via = (event.submitter as HTMLElement | null)?.dataset.via ?? 'line';
    if (via === 'email') {
      window.location.href =
        'mailto:' + (d.email ?? '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    } else if (via === 'instagram') {
      // Instagram can't be pre-filled: copy the message, then open the DM.
      copyText(subject + '\n' + body);
      window.open(d.igUrl ?? '', '_blank', 'noopener');
    } else {
      openLineUri(
        'oaMessage/' + encodeURIComponent(d.lineId ?? '') + '/?' + encodeURIComponent(subject + '\n' + body),
      );
    }

    if (errorEl) errorEl.hidden = true;
    if (successEl) {
      successEl.textContent =
        (via === 'email' ? d.successEmail : via === 'instagram' ? d.successIg : d.successLine) ?? '';
      successEl.hidden = false;
    }
  });
}
