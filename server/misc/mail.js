let Emailer = class mailer {
  constructor(to, from, subject, html) {
    (this.to = to),
      (this.from = from),
      (this.subject = subject),
      (this.html = html);
  }
};

module.exports = Emailer;
