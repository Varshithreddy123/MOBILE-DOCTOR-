import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const DoctorBookingWelcomeEmail = ({
  patientName = "Patient Name",
  doctorName = "Dr. Smith",
  appointmentDate = "January 1, 2023",
  appointmentTime = "10:00 AM",
  clinicAddress = "123 Medical Drive, Health City",
  phoneNumber = "(123) 456-7890",
  bookingReference = "REF123456",
  clinicLogoUrl = "https://res.cloudinary.com/your-account/image/upload/logo.jpg"
}) => (
  <Html>
    <Head />
    <Preview>Your appointment with {doctorName} has been confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={clinicLogoUrl}
            alt="Clinic Logo"
            width={150}
            height={50}
            style={logo}
          />
          <Text style={header}>Appointment Confirmed!</Text>
          
          <Text style={paragraph}>Dear {patientName},</Text>
          <Text style={paragraph}>
            Your appointment with <strong>{doctorName}</strong> has been successfully scheduled.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailLabel}>Appointment Details:</Text>
            <Text style={detailItem}>
              <strong>Date:</strong> {appointmentDate}
            </Text>
            <Text style={detailItem}>
              <strong>Time:</strong> {appointmentTime}
            </Text>
            <Text style={detailItem}>
              <strong>Doctor:</strong> {doctorName}
            </Text>
            <Text style={detailItem}>
              <strong>Location:</strong> {clinicAddress}
            </Text>
            <Text style={detailItem}>
              <strong>Your Phone:</strong> {phoneNumber || 'Not provided'}
            </Text>
            <Text style={detailItem}>
              <strong>Booking Reference:</strong> {bookingReference}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={primaryButton} href="https://yourclinic.com/dashboard">
              View Appointment
            </Button>
            <Button style={secondaryButton} href="https://yourclinic.com/reschedule">
              Reschedule
            </Button>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            <strong>Your Clinic Name</strong><br />
            {clinicAddress}<br />
            Phone: (123) 456-7890 | Email: info@yourclinic.com
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Style Constants - Make sure all these are defined
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  border: '1px solid #e2e8f0',
};

const box = {
  padding: '0 40px',
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
  width: '150px',
  height: 'auto',
};

const header = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '0 0 20px',
};

const paragraph = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '1.5',
  textAlign: 'left',
  margin: '0 0 16px',
};

const detailsContainer = {
  backgroundColor: '#f1f5f9',
  padding: '16px',
  borderRadius: '6px',
  margin: '20px 0',
  borderLeft: '4px solid #3b82f6',
};

const detailLabel = {
  ...paragraph,
  fontWeight: 'bold',
  marginBottom: '12px',
  color: '#1e293b',
};

const detailItem = {
  ...paragraph,
  margin: '0 0 8px',
  fontSize: '15px',
};

const buttonContainer = {
  margin: '24px 0',
  textAlign: 'center',
};

const primaryButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
};

const secondaryButton = {
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  color: '#3b82f6',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  width: '100%',
  padding: '12px',
  border: '1px solid #3b82f6',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center',
  margin: '0',
};

export default DoctorBookingWelcomeEmail;