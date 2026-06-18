export const scrollDashboardToTop = (): void => {
  const main = document.getElementById('dashboard-main-scroll');
  const anchor = document.getElementById('medical-record-top');

  if (main) {
    main.scrollTop = 0;
  }

  if (anchor) {
    anchor.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};

export const scrollDashboardToTopAfterPaint = (): void => {
  scrollDashboardToTop();
  requestAnimationFrame(() => {
    scrollDashboardToTop();
    requestAnimationFrame(scrollDashboardToTop);
  });
};
