import { useEffect, useState } from 'react'
import { ROUTES } from '../../resources/routes'
import { useMails } from '../../hooks/useMails'

function MailScreen() {
  const { loading, error, success, logout, sendMail, getInbox, getSent, getMail } =
    useMails()
  const [mails, setMails] = useState([])
  const [selectedMail, setSelectedMail] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [title, setTitle] = useState('Inbox')

  const getMailsFromResponse = (data) => {
    if (Array.isArray(data?.data?.data)) {
      return data.data.data
    }

    if (Array.isArray(data?.data)) {
      return data.data
    }

    if (Array.isArray(data?.mails)) {
      return data.mails
    }

    if (Array.isArray(data)) {
      return data
    }

    return []
  }

  const loadInbox = async () => {
    const data = await getInbox()
    setTitle('Inbox')
    setSelectedMail(null)
    setShowDialog(false)
    setMails(getMailsFromResponse(data))
  }

  const loadSent = async () => {
    const data = await getSent()
    setTitle('Sent')
    setSelectedMail(null)
    setShowDialog(false)
    setMails(getMailsFromResponse(data))
  }

  const handleSend = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const requestData = new FormData()

    requestData.append('to', formData.get('to'))
    requestData.append('subject', formData.get('subject'))
    requestData.append('body', formData.get('body'))

    formData.getAll('attachments').forEach((file) => {
      if (file.size > 0) {
        requestData.append('attachments[]', file)
      }
    })

    const data = await sendMail(requestData)

    if (data) {
      event.currentTarget.reset()
      await loadSent()
    }
  }

  const handleFindMail = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    await openMail(formData.get('mailId'))
  }

  const openMail = async (id) => {
    if (!id) {
      return
    }

    const data = await getMail(id)

    setSelectedMail(data?.data || data?.mail || data)
    setShowDialog(true)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = ROUTES.login
  }

  const getMailList = () => {
    if (Array.isArray(mails)) {
      return mails
    }

    return []
  }

  const getAttachments = (mail) => {
    const attachments = mail.attachments || mail.files || mail.attachment || []

    if (Array.isArray(attachments)) {
      return attachments
    }

    return [attachments]
  }

  const getAttachmentName = (attachment, index) => {
    if (typeof attachment === 'string') {
      return attachment.split('/').pop() || `Attachment ${index + 1}`
    }

    return (
      attachment.name ||
      attachment.file_name ||
      attachment.filename ||
      attachment.original_name ||
      `Attachment ${index + 1}`
    )
  }

  const getAttachmentUrl = (attachment) => {
    if (typeof attachment === 'string') {
      return attachment
    }

    return attachment.url || attachment.path || attachment.file_path || ''
  }

  const renderAttachments = (mail) => {
    const attachments = getAttachments(mail).filter(Boolean)

    if (attachments.length === 0) {
      return null
    }

    return (
      <div className="attachments-box">
        <b>Attachments:</b>
        {attachments.map((attachment, index) => {
          const name = getAttachmentName(attachment, index)
          const url = getAttachmentUrl(attachment)

          return url ? (
            <a key={`${name}-${index}`} href={url} target="_blank">
              {name}
            </a>
          ) : (
            <span key={`${name}-${index}`}>{name}</span>
          )
        })}
      </div>
    )
  }

  const renderMail = (mail) => (
    <button
      className="mail-item"
      key={mail.id || mail.subject}
      type="button"
      onClick={() => openMail(mail.id)}
      disabled={!mail.id || loading}
    >
      <div className="mail-item-top">
        <strong>{mail.subject || 'No subject'}</strong>
        {mail.id && <span>ID: {mail.id}</span>}
      </div>
      <p>
        <b>From:</b> {mail.from || mail.sender || '-'}
      </p>
      <p>
        <b>To:</b> {mail.to || mail.receiver || '-'}
      </p>
      <p>
        <b>Message:</b> {mail.body || mail.message || 'No message'}
      </p>
      {renderAttachments(mail)}
    </button>
  )

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      window.location.href = ROUTES.login
      return
    }

    const timer = window.setTimeout(() => {
      loadInbox()
    }, 0)

    return () => window.clearTimeout(timer)
    // Load the default mailbox once when the dashboard opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="mail-page">
      <section className="mail-box">
        <div className="mail-header">
          <div>
            <h1>Mail Dashboard</h1>
            <p>Send mail, check inbox, and view sent messages.</p>
          </div>
          <button type="button" onClick={handleLogout} disabled={loading}>
            Logout
          </button>
        </div>

        {error && (
          <div className="alert-box alert-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert-box alert-success" role="status">
            {success}
          </div>
        )}

        <div className="mail-layout">
          <section className="mail-section">
            <h2>Send Mail</h2>

            <form className="mail-form" onSubmit={handleSend}>
              <label htmlFor="to">Receiver email</label>
              <input id="to" name="to" type="email" required />

              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" required />

              <label htmlFor="body">Message</label>
              <textarea id="body" name="body" rows="5" required></textarea>

              <label htmlFor="attachments">Attachments</label>
              <input id="attachments" name="attachments" type="file" multiple />

              <button type="submit" disabled={loading}>
                Send Mail
              </button>
            </form>
          </section>

          <section className="mail-section">
            <h2>Mailbox</h2>

            <div className="mail-actions">
              <button type="button" onClick={loadInbox} disabled={loading}>
                Inbox
              </button>
              <button type="button" onClick={loadSent} disabled={loading}>
                Sent
              </button>
            </div>

            <form className="mail-form" onSubmit={handleFindMail}>
              <label htmlFor="mailId">Find mail by ID</label>
              <div className="mail-search">
                <input id="mailId" name="mailId" type="number" min="1" required />
                <button type="submit" disabled={loading}>
                  Show
                </button>
              </div>
            </form>

            <div className="mail-list">
              <h3>{title}</h3>

              {loading ? (
                <p>Loading...</p>
              ) : getMailList().length > 0 ? (
                getMailList().map((mail) => renderMail(mail))
              ) : (
                <p>No inbox mails found.</p>
              )}
            </div>
          </section>
        </div>

        {showDialog && selectedMail && (
          <div className="dialog-backdrop">
            <div className="mail-dialog" role="dialog" aria-modal="true">
              <div className="dialog-header">
                <h2>{selectedMail.subject || 'No subject'}</h2>
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  aria-label="Close"
                >
                  X
                </button>
              </div>

              {selectedMail.id && <p>ID: {selectedMail.id}</p>}
              <p>
                <b>From:</b> {selectedMail.from || selectedMail.sender || '-'}
              </p>
              <p>
                <b>To:</b> {selectedMail.to || selectedMail.receiver || '-'}
              </p>
              <p>
                <b>Message:</b>
              </p>
              <p>{selectedMail.body || selectedMail.message || 'No message'}</p>
              {renderAttachments(selectedMail)}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default MailScreen
