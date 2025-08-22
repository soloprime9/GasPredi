// pages/contact.js
import Head from "next/head";

export default function ContactUs() {
  return (
    <>
      <Head>
        <title>Contact Us - Today Written Update</title>
        <meta
          name="description"
          content="Get in touch with Today Written Update. Share feedback, ask questions, or report issues to help us improve your experience."
        />
        <meta
          name="keywords"
          content="Contact Today Written Update, Website Feedback, Content Queries, Suggestions"
        />
        <link
          rel="canonical"
          href="https://todaywrittenupdate.blog/contact"
        />
        <meta property="og:title" content="Contact Us - Today Written Update" />
        <meta
          property="og:description"
          content="Reach out to Today Written Update for feedback, queries, or suggestions."
        />
        <meta
          property="og:image"
          content="https://todaywrittenupdate.blog/logo.jpg"
        />
        <meta
          property="og:url"
          content="https://todaywrittenupdate.blog/contact"
        />
      </Head>

      <main className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
            Contact Us
          </h1>

          <p className="mb-4">
            Welcome to <strong>Today Written Update</strong>, we’re always eager
            to hear from you. Whether you want to share feedback, ask questions,
            or simply say hello, we’re here and ready to listen. At{" "}
            <strong>Today Written Update</strong>, your thoughts and suggestions
            help us grow, improve, and deliver a better experience.
          </p>

          <p className="font-semibold">You can contact us for any of the following:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <b>Website Feedback:</b> Thoughts, opinions, or comments about
              our website’s design or functionality.
            </li>
            <li>
              <b>Content Queries:</b> Questions or concerns about our content.
            </li>
            <li>
              <b>Corrections or Updates:</b> Report incorrect or outdated
              information.
            </li>
            <li>
              <b>Design Suggestions:</b> Ideas to improve the site’s appearance
              or usability.
            </li>
            <li>
              <b>Improvement Suggestions:</b> Ways to enhance our site’s
              content, tools, or features.
            </li>
            <li>
              <b>Technical Issues:</b> Report errors, bugs, or issues.
            </li>
          </ul>

          <p className="mb-4">
            Our contact page is generated with the help of{" "}
            <a
              href="https://serprack.com"
              className="text-yellow-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us Generator
            </a>
            .
          </p>

          <p className="mb-4">
            We welcome all your comments, suggestions, and concerns, as they
            help us make <strong>Today Written Update</strong> a better platform
            for everyone.
          </p>

          <p className="mb-2 font-semibold">Don't hesitate to contact us:</p>
          <p className="mb-4">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:serialupdate2626@gmail.com"
              className="text-blue-600 underline"
            >
              serialupdate2626@gmail.com
            </a>
          </p>

          <p>We look forward to assisting you! Thank you for being part of our community.</p>
        </div>
      </main>
    </>
  );
      }
