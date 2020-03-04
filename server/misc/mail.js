let Emailer = class mailer {
  constructor(bcc, from, subject, html) {
    (this.bcc = bcc),
      (this.from = from),
      (this.subject = subject),
      (this.html = html);
  }
};

module.exports = Emailer;
