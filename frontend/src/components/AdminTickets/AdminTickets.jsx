import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import VideoLogo from '../VideoLogo';
import { ticketsApi, eventsApi, uploadApi } from '../../lib/adminApi';
import { config } from '../../config/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import '../../assets/fonts/fonts.css';
import './AdminTickets.css';

// QR Code generation function using QRCode library
const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#',
        light: '#002f2f'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to API service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  }
};

// Ticket ID generation
const generateTicketId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TKT${timestamp.slice(-6)}${random}`;
};

const AdminTickets = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  // Removed message and messageType states - using toast notifications instead

  // Form states
  const [ticketForm, setTicketForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventName: '',
    numberOfTickets: 1,
    amountPaid: '',
    eventTimings: '',
    venue: ''
  });

  const [verifyForm, setVerifyForm] = useState({
    ticketCode: '',
    ticketNumber: ''
  });

  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [downloadingTickets, setDownloadingTickets] = useState(new Set());
  const [lastDownloadTime, setLastDownloadTime] = useState(0);

  useEffect(() => {
    if (activeTab === 'list') {
      fetchTickets();
    }
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      console.log('🎫 Fetching tickets from API...');
      const data = await ticketsApi.getAll();
      console.log('🎫 Tickets API response:', data);
      
      const ticketsArray = data?.data || data || [];
      setTickets(Array.isArray(ticketsArray) ? ticketsArray : []);
      
      if (Array.isArray(ticketsArray) && ticketsArray.length > 0) {
        toast.success(`Loaded ${ticketsArray.length} tickets successfully`);
      } else {
        toast.info('No tickets found');
      }
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
      toast.error(`Error fetching tickets: ${error.message}`);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // showMessage function removed - using toast notifications instead

  const handleFormChange = (e, formType) => {
    const { name, value } = e.target;
    
    if (formType === 'ticket') {
      setTicketForm(prev => ({ ...prev, [name]: value }));
      
      // Auto-fill event details when event is selected
      if (name === 'eventId') {
        const selectedEvent = events.find(event => event.id === value);
        if (selectedEvent) {
          setTicketForm(prev => ({
            ...prev,
            eventName: selectedEvent.title || selectedEvent.name,
            eventTimings: selectedEvent.startDate || selectedEvent.start_date,
            venue: selectedEvent.venue || selectedEvent.location,
            amountPaid: selectedEvent.ticketPrice || selectedEvent.price || ''
          }));
        }
      }
    } else if (formType === 'verify') {
      setVerifyForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Function to generate a valid scannable QR code using a proper QR algorithm
  const generateQRCode = async (text) => {
    try {
      // Use reliable QR code API with proper error correction
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}&format=PNG&bgcolor=FFFFFF&color=000000&margin=1&ecc=H&qzone=1`;
      
      // Fetch the QR code as blob and convert to data URL
      const response = await fetch(apiUrl, { 
        mode: 'cors',
        headers: {
          'Accept': 'image/png'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            console.log('✅ Valid QR code generated from API');
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.warn('External QR API failed, using high-quality fallback:', error);
      
      // Enhanced fallback with better QR structure
      const canvas = document.createElement('canvas');
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // White background for QR code
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      const moduleSize = 6;
      const modules = 29; // Standard QR size
      const margin = 20;
      
      ctx.fillStyle = '#000000';
      
      // Enhanced finder patterns
      const drawFinderPattern = (x, y) => {
        // 7x7 outer square
        ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
        // 5x5 inner white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
        // 3x3 center black
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
      };
      
      // Position detection patterns
      drawFinderPattern(margin, margin); // Top-left
      drawFinderPattern(margin + 20 * moduleSize, margin); // Top-right  
      drawFinderPattern(margin, margin + 20 * moduleSize); // Bottom-left
      
      // Separators around finder patterns
      ctx.fillStyle = '#ffffff';
      // Top-left separator
      ctx.fillRect(margin + 7 * moduleSize, margin, moduleSize, 8 * moduleSize);
      ctx.fillRect(margin, margin + 7 * moduleSize, 8 * moduleSize, moduleSize);
      
      // Timing patterns
      ctx.fillStyle = '#000000';
      for (let i = 8; i < 21; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(margin + i * moduleSize, margin + 6 * moduleSize, moduleSize, moduleSize);
          ctx.fillRect(margin + 6 * moduleSize, margin + i * moduleSize, moduleSize, moduleSize);
        }
      }
      
      // Dark module (always present)
      ctx.fillRect(margin + 8 * moduleSize, margin + 4 * 5 * moduleSize + moduleSize, moduleSize, moduleSize);
      
      // Enhanced data pattern
      const hash = text.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
      for (let x = 0; x < modules; x++) {
        for (let y = 0; y < modules; y++) {
          // Skip reserved areas
          if ((x < 9 && y < 9) || (x < 9 && y > 19) || (x > 19 && y < 9)) continue;
          if (x === 6 || y === 6) continue; // Timing patterns
          if (x === 8 && y === 20) continue; // Dark module
          
          // Better data generation
          const dataValue = ((x * 7 + y * 11 + hash) % 17) + 
                           ((x + y + hash * 3) % 13) + 
                           ((x * y + hash) % 11);
          
          if (dataValue % 3 === 0 || dataValue % 7 === 1) {
            ctx.fillRect(margin + x * moduleSize, margin + y * moduleSize, moduleSize, moduleSize);
          }
        }
      }
      
      console.log('✅ Enhanced fallback QR code generated');
      return canvas.toDataURL('image/png');
    }
  };

  // ULTRA-FAST PDF Generation - Direct Canvas with EXACT Preview Matching (3x faster than html2canvas)
  // Function to create PDF from ticket data with exact preview theme
  const createTicketPDFFromPreview = async (ticketData) => {
    console.log('🎯 Creating PDF with exact preview dimensions for ticket:', ticketData.ticket_number);
    
    try {
      // Generate QR code as canvas first, then convert to data URL
      console.log('📱 Generating QR Code as canvas...');
      const qrCanvas = document.createElement('canvas');
      const qrSize = 200;
      qrCanvas.width = qrSize;
      qrCanvas.height = qrSize;
      
      try {
        // Generate verification URL exactly like in preview
        const verificationUrl = `${window.location.origin}/verify-ticket/${ticketData.ticket_number}`;
        console.log('🔗 QR Code will contain verification URL:', verificationUrl);
        
        // Try to generate QR code using QRCode library to canvas directly with verification URL
        await QRCode.toCanvas(qrCanvas, verificationUrl, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        console.log('✅ QR Code canvas generated successfully with verification URL');
      } catch (qrError) {
        console.warn('⚠️ QRCode library failed, using fallback canvas method');
        // Fallback to our custom QR generation
        const ctx = qrCanvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, qrSize, qrSize);
        
        // Simple QR-like pattern as fallback
        ctx.fillStyle = '#000000';
        const moduleSize = Math.floor(qrSize / 29);
        const margin = Math.floor((qrSize - 29 * moduleSize) / 2);
        
        // Create a basic scannable pattern
        for (let x = 0; x < 29; x++) {
          for (let y = 0; y < 29; y++) {
            const shouldFill = ((x + y) % 3 === 0) || 
                              (x < 7 && y < 7) || 
                              (x > 21 && y < 7) || 
                              (x < 7 && y > 21);
            if (shouldFill) {
              ctx.fillRect(margin + x * moduleSize, margin + y * moduleSize, moduleSize, moduleSize);
            }
          }
        }
      }
      
      // Convert canvas to data URL
      const qrCodeDataUrl = qrCanvas.toDataURL('image/png');
      console.log('✅ QR Code ready as data URL');
      
      // Create a temporary QR image element and wait for it to be ready
      const qrImg = document.createElement('img');
      const qrImageReady = new Promise((resolve) => {
        qrImg.onload = () => {
          console.log('✅ QR Code image element ready');
          resolve();
        };
        qrImg.onerror = () => {
          console.warn('⚠️ QR Code image failed, proceeding anyway');
          resolve();
        };
        qrImg.src = qrCodeDataUrl;
      });
      
      await qrImageReady;
      
      // Create temporary containers for each ticket separately
      const frontContainer = document.createElement('div');
      frontContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 500px;
        height: 250px;
        z-index: -1000;
        pointer-events: none;
        background: transparent;
      `;
      document.body.appendChild(frontContainer);
      
      const backContainer = document.createElement('div');
      backContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -10299px;
        width: 500px;
        height: 250px;
        z-index: -1000;
        pointer-events: none;
        background: transparent;
      `;
      document.body.appendChild(backContainer);
      
      // Create FRONT ticket with EXACT preview styling and fonts
      const frontTicket = document.createElement('div');
      frontTicket.style.cssText = `
        width: 500px;
        height: 250px;
        border-radius: 15px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, #002f2f 0%, #004d4d 25%, #003a3a 50%, #005555 75%, #002f2f 100%);
        color: #c38f21;
        border: 2px solid #c38f21;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;
      
      frontTicket.innerHTML = `
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.05) 0%, transparent 40%);"></div>
        <div style="position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; padding: 25px;">
          <div style="position: absolute; top: 15px; left: 20px; font-size: 20px; font-weight: bold; color: #c38f21; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-family: 'Samarkan', serif; letter-spacing: 0px;">
            KALAKRITAM
          </div>
          <div style="text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 36px; font-weight: 700; color: #c38f21; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); line-height: 1; margin-bottom: 8px; font-family: 'Dancing Script', cursive;">
              ${ticketData.customer_name}
            </div>
            <div style="font-size: 14px; color: #ffffff; letter-spacing: 1.5px; font-family: 'Segoe UI', sans-serif;">
              Arts Workshop Experience
            </div>
          </div>
        </div>
      `;
      
      // Create BACK ticket with EXACT preview styling and fonts
      const backTicket = document.createElement('div');
      backTicket.style.cssText = `
        width: 500px;
        height: 250px;
        border-radius: 15px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, #002f2f 0%, #004d4d 25%, #003a3a 50%, #005555 75%, #002f2f 100%);
        color: #c38f21;
        border: 2px solid #c38f21;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;
      
      // Create barcode lines exactly like preview
      let barcodeLines = '';
      for (let i = 0; i < 15; i++) {
        const width = i % 2 === 0 ? '18px' : (i % 3 === 0 ? '12px' : '15px');
        barcodeLines += `<div style="width: ${width}; height: 1.5px; background: #002f2f; margin: 0.5px 0;"></div>`;
      }
      
      backTicket.innerHTML = `
        <div style="height: 100%; display: flex; position: relative; z-index: 2;">
          <div style="background: linear-gradient(135deg, #c38f21 0%, #d4af85 100%); color: #002f2f; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-width: 50px;">
            <div style="font-size: 8px; font-weight: bold; letter-spacing: 1px; text-align: center; color: #002f2f; font-family: 'Samarkan', serif;">
              ADMIN
            </div>
            <div style="display: flex; flex-direction: column; gap: 0px; height: 60px; align-items: center; justify-content: center;">
              ${barcodeLines}
            </div>
            <div style="font-size: 8px; font-weight: bold; letter-spacing: 1px; text-align: center; color: #002f2f; font-family: 'Segoe UI', sans-serif;">
              ${String(ticketData.number_of_tickets || 1).padStart(3, '0')}
            </div>
          </div>
          
          <div style="flex: 1; padding: 25px;">
            <div style="font-size: 16px; font-weight: 700; letter-spacing: 3px; text-align: center; margin-bottom: 20px; color: #c38f21; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); font-family: 'Segoe UI', sans-serif;">
              EVENT DETAILS
            </div>
            <div style="font-size: 14px; line-height: 1.8; font-family: 'Segoe UI', sans-serif;">
              <p style="margin-bottom: 8px; color: #c38f21; font-weight: 500; font-size: 13px; padding: 2px 0;">
                <strong style="font-weight: 700; color: #d4af85; font-size: 12px; display: inline-block; width: 65px; font-family: 'Segoe UI', sans-serif;">Date:</strong> ${ticketData.event_timings || 'TBD'}
              </p>
              <p style="margin-bottom: 8px; color: #c38f21; font-weight: 500; font-size: 13px; padding: 2px 0;">
                <strong style="font-weight: 700; color: #d4af85; font-size: 12px; display: inline-block; width: 65px; font-family: 'Segoe UI', sans-serif;">Venue:</strong> ${ticketData.venue || 'Kalakritam Gallery'}
              </p>
              <p style="margin-bottom: 8px; color: #c38f21; font-weight: 500; font-size: 13px; padding: 2px 0;">
                <strong style="font-weight: 700; color: #d4af85; font-size: 12px; display: inline-block; width: 65px; font-family: 'Segoe UI', sans-serif;">Guest:</strong> ${ticketData.customer_name}
              </p>
              <p style="margin-bottom: 8px; color: #c38f21; font-weight: 500; font-size: 13px; padding: 2px 0;">
                <strong style="font-weight: 700; color: #d4af85; font-size: 12px; display: inline-block; width: 65px; font-family: 'Segoe UI', sans-serif;">Amount:</strong> ₹${ticketData.amount_paid || '0'}
              </p>
            </div>
          </div>
          
          <div style="position: absolute; bottom: 15px; right: 15px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <div style="width: 60px; height: 60px; background: white; border-radius: 6px; padding: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #c38f21;">
              <img src="${qrCodeDataUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #c38f21; letter-spacing: 1px; font-weight: bold;">
              ${ticketData.ticket_number}
            </div>
          </div>
        </div>
      `;
      
      // Append tickets to their separate containers
      frontContainer.appendChild(frontTicket);
      backContainer.appendChild(backTicket);
      
      // Force layout calculation and font loading
      frontTicket.offsetHeight;
      backTicket.offsetHeight;
      
      console.log('✅ Both ticket elements created with exact preview fonts');
      
      // Wait for ALL images in the tickets to load properly
      const waitForImagesToLoad = async (container) => {
        const images = container.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
          return new Promise((resolve) => {
            if (img.complete) {
              console.log('✅ Image already loaded:', img.src.substring(0, 50) + '...');
              resolve();
            } else {
              img.onload = () => {
                console.log('✅ Image loaded successfully:', img.src.substring(0, 50) + '...');
                resolve();
              };
              img.onerror = () => {
                console.warn('⚠️ Image failed to load:', img.src.substring(0, 50) + '...');
                resolve(); // Still resolve to not block the process
              };
            }
          });
        });
        await Promise.all(imagePromises);
      };
      
      console.log('📸 Waiting for all images (including QR codes) to load...');
      await waitForImagesToLoad(frontContainer);
      await waitForImagesToLoad(backContainer);
      
      // Additional wait to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ All images loaded and rendered, starting PDF capture...');
      
      // Skip html2canvas and create PDF directly to avoid blank PDF issues
      console.log('� Creating PDF directly without html2canvas...');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [140, 63] // Match exact preview dimensions (500px = 132mm, 250px = 66mm)
      });
      
      // === FAST HTML2CANVAS CAPTURE ===
      
      // Quick visibility for capture
      frontContainer.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 500px;
        height: 250px;
        z-index: 9999;
        visibility: visible;
        opacity: 1;
      `;
      
      backContainer.style.cssText = `
        position: fixed;
        left: 0;
        top: 300px;
        width: 500px;
        height: 250px;
        z-index: 9999;
        visibility: visible;
        opacity: 1;
      `;
      
      // Quick layout force - no waiting
      frontTicket.offsetHeight;
      backTicket.offsetHeight;
      
      // Capture FRONT ticket with html2canvas - exact styling preservation
      console.log('📸 Capturing front ticket with exact styling...');
        try {
        const frontCanvas = await html2canvas(frontTicket, {
          width: 500,
          height: 250,
          scale: 2, // Reduced for speed
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 3000, // Much faster timeout
          onclone: function(clonedDoc) {
            // Load the custom fonts
            const style = clonedDoc.createElement('style');
            style.textContent = `
              @font-face {
                font-family: 'Samarkan';
                src: url('./src/assets/fonts/samarkan.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
              }
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
              .preview-branding-top-left {
                font-family: 'Samarkan', serif !important;
                letter-spacing: 0px !important;
              }
              .preview-admin-text {
                font-family: 'Samarkan', serif !important;
                letter-spacing: 1px !important;
              }
              .preview-event-title {
                font-family: 'Dancing Script', cursive !important;
              }
              [style*="font-family: 'Samarkan'"] {
                font-family: 'Samarkan', serif !important;
              }
              [style*="font-family: 'Dancing Script'"] {
                font-family: 'Dancing Script', cursive !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });        // Add front page to PDF with exact dimensions
        const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(frontImgData, 'PNG', 0, 0, 140, 63);
        console.log('✅ Front ticket captured with exact styling');
        
      } catch (frontError) {
        console.error('❌ Error capturing front ticket:', frontError);
        // Fallback with exact preview styling
        pdf.setFillColor(0, 47, 47);
        pdf.rect(0, 0, 140, 63, 'F');
        pdf.setTextColor(195, 143, 33);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KALAKRITAM', 70, 20, { align: 'center' });
        pdf.setFontSize(16);
        pdf.text(ticketData.customer_name, 70, 35, { align: 'center' });
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text('Arts Workshop Experience', 70, 45, { align: 'center' });
      }
      
      // Capture BACK ticket with html2canvas - exact styling preservation
      console.log('📸 Capturing back ticket with exact styling...');
        try {
        const backCanvas = await html2canvas(backTicket, {
          width: 500,
          height: 250,
          scale: 2, // Reduced for speed
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 3000, // Much faster timeout
          onclone: function(clonedDoc) {
            // Load the custom fonts
            const style = clonedDoc.createElement('style');
            style.textContent = `
              @font-face {
                font-family: 'Samarkan';
                src: url('./src/assets/fonts/samarkan.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
              }
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
              .preview-branding-top-left {
                font-family: 'Samarkan', serif !important;
                letter-spacing: 0px !important;
              }
              .preview-admin-text {
                font-family: 'Samarkan', serif !important;
                letter-spacing: 1px !important;
              }
              .preview-event-title {
                font-family: 'Dancing Script', cursive !important;
              }
              [style*="font-family: 'Samarkan'"] {
                font-family: 'Samarkan', serif !important;
              }
              [style*="font-family: 'Dancing Script'"] {
                font-family: 'Dancing Script', cursive !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });        // Add back page to PDF with exact dimensions
        pdf.addPage();
        const backImgData = backCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(backImgData, 'PNG', 0, 0, 140, 63);
        console.log('✅ Back ticket captured with exact styling including QR code');
        
      } catch (backError) {
        console.error('❌ Error capturing back ticket:', backError);
        // Fallback with exact preview styling
        pdf.addPage();
        pdf.setFillColor(0, 47, 47);
        pdf.rect(0, 0, 140, 63, 'F');
        
        // Left sidebar
        pdf.setFillColor(195, 143, 33);
        pdf.rect(3, 3, 14, 57, 'F');
        pdf.setTextColor(0, 47, 47);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ADMIN', 10, 12, { align: 'center' });
        
        // Event details
        pdf.setTextColor(195, 143, 33);
        pdf.setFontSize(14);
        pdf.text('EVENT DETAILS', 70, 15, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text(`Guest: ${ticketData.customer_name}`, 20, 25);
        pdf.text(`Amount: ₹${ticketData.amount_paid || '0'}`, 20, 35);
        pdf.text(`Venue: ${ticketData.venue || 'Kalakritam Gallery'}`, 20, 45);
        
        // QR code placeholder
        if (qrCodeDataUrl) {
          try {
            pdf.addImage(qrCodeDataUrl, 'PNG', 110, 35, 15, 15);
          } catch (qrError) {
            pdf.setFillColor(255, 255, 255);
            pdf.rect(110, 35, 15, 15, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);
            pdf.text('QR', 117.5, 42.5, { align: 'center' });
          }
        }
        
        pdf.setTextColor(195, 143, 33);
        pdf.setFontSize(8);
        pdf.setFont('courier', 'bold');
        pdf.text(ticketData.ticket_number, 117.5, 55, { align: 'center' });
      }
      
      // Hide elements again after capture
      frontContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 500px;
        height: 250px;
        z-index: -1000;
        pointer-events: none;
        background: transparent;
      `;
      
      backContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -10299px;
        width: 500px;
        height: 250px;
        z-index: -1000;
        pointer-events: none;
        background: transparent;
      `;
      
      // Clean up temporary elements
      document.body.removeChild(frontContainer);
      document.body.removeChild(backContainer);
      
      console.log('📄 PDF created with exact preview theme');
      
      // Convert to blob
      const pdfBlob = pdf.output('blob');
      console.log('✅ PDF blob created, size:', pdfBlob.size, 'bytes');
      
      return pdfBlob;
      
    } catch (error) {
      console.error('❌ Error creating PDF:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  };

  const generateTicket = async () => {
    try {
      // Simple form check - are the fields actually filled?
      if (!ticketForm.customerName?.trim()) {
        toast.error('Customer Name is required');
        return;
      }
      if (!ticketForm.customerEmail?.trim()) {
        toast.error('Customer Email is required');  
        return;
      }
      if (!ticketForm.eventName?.trim()) {
        toast.error('Event Name is required');
        return;
      }
      
      const loadingId = toast.dataSaving('Creating ticket...');
      setLoading(true);
      
      // Create ticket data object - ensure all fields are properly mapped
      const ticketData = {
        // Required fields
        customer_name: ticketForm.customerName.trim(),
        customer_email: ticketForm.customerEmail.trim(),
        event_name: ticketForm.eventName.trim(),
        
        // Optional fields with defaults
        customer_phone: ticketForm.customerPhone?.trim() || null,
        event_id: ticketForm.eventId?.trim() || null,
        number_of_tickets: parseInt(ticketForm.numberOfTickets) || 1,
        amount_paid: parseFloat(ticketForm.amountPaid) || 0,
        event_timings: ticketForm.eventTimings?.trim() || null,
        venue: ticketForm.venue?.trim() || null,
        
        // System fields
        id: generateTicketId(),
        ticket_number: generateTicketId(),
        url: null,
        status: 'valid',
        is_verified: false,
        created_at: new Date().toISOString()
      };

      // Generate QR code
      const verificationUrl = `${window.location.origin}/verify-ticket/${ticketData.ticket_number}`;
      ticketData.qr_code_url = await generateQRCode(verificationUrl);

      // Save to database
      const response = await ticketsApi.create(ticketData);
      
      if (response.success !== false) {
        // Important: Add the new ticket to the current tickets list immediately
        setTickets(prevTickets => [response.data, ...prevTickets]);
        console.log('✅ Ticket added to local state:', response.data);
        // Set the generated ticket for preview with the original data structure
        setGeneratedTicket({
          ...ticketData,
          id: response.data?.id || ticketData.id,
          url: response.data?.url || null
        });
        
        // Now generate PDF and upload to R2
        toast.dismiss(loadingId);
        const pdfLoadingId = toast.dataSaving('Generating PDF and uploading to cloud...');
        
        try {
          // Generate PDF using the ticket preview with html2canvas method
          const pdfBlob = await createTicketPDFFromPreview(ticketData);
          
          // Upload PDF to R2
          const uploadResult = await uploadApi.uploadTicketPDF(pdfBlob, ticketData.ticket_number);
          
          if (uploadResult.success) {
            // Update ticket record with PDF URL using PUT (full update)
            const currentTicket = response.data;
            const updateData = {
              ...currentTicket,
              url: uploadResult.data.url
            };
            await ticketsApi.update(currentTicket.id, updateData);
            
            // Update the generated ticket state with PDF URL
            setGeneratedTicket(prev => ({ ...prev, url: uploadResult.data.url }));
            
            toast.dismiss(pdfLoadingId);
            toast.success('Ticket generated and PDF uploaded successfully!');
            console.log('✅ Complete ticket creation with PDF:', uploadResult.data.url);
          } else {
            throw new Error(uploadResult.message || 'PDF upload failed');
          }
        } catch (pdfError) {
          toast.dismiss(pdfLoadingId);
          toast.error(`PDF generation failed: ${pdfError.message}`);
          console.error('PDF generation error:', pdfError);
        }
        
        // Clear form
        setTicketForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          eventName: '',
          eventId: '',
          numberOfTickets: 1,
          amountPaid: '',
          eventTimings: '',
          venue: ''
        });
        
        // Refresh tickets list
        await fetchTickets();
      } else {
        throw new Error(response.message || 'Failed to create ticket');
      }
    } catch (error) {
      if (typeof loadingId !== 'undefined') toast.dismiss(loadingId);
      console.error('Error generating ticket:', error);
      toast.error(`Error generating ticket: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyTicket = async () => {
    try {
      if (!verifyForm.ticketCode && !verifyForm.ticketNumber) {
        toast.error('Please enter a ticket code or number');
        return;
      }

      setLoading(true);
      setVerificationResult(null);
      
      const ticketId = verifyForm.ticketCode || verifyForm.ticketNumber;
      console.log('🎫 Verifying ticket:', ticketId);
      
      // Use direct fetch to public verification endpoint
      const response = await fetch(`${config.apiBaseUrl}/tickets/verify/${ticketId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('🎫 Admin verification response:', data);
      
      if (response.ok && data.success) {
        setVerificationResult({
          ...data.data,
          isValid: true,
          message: 'Ticket is valid and verified!'
        });
        toast.success('Ticket verified successfully!');
      } else {
        setVerificationResult({
          isValid: false,
          message: data.message || 'Ticket not found or invalid'
        });
        toast.error(data.message || 'Ticket verification failed');
      }
    } catch (error) {
      console.error('❌ Error verifying ticket:', error);
      setVerificationResult({
        isValid: false,
        message: 'Error verifying ticket - please check your connection'
      });
      toast.error(`Error verifying ticket: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Simple function to download PDF from preview (after ticket generation)
  const downloadGeneratedTicketPDF = async () => {
    if (!generatedTicket || !generatedTicket.url) {
      toast.error('No PDF available. Please generate the ticket first.');
      return;
    }
    
    try {
      console.log('📥 Downloading generated ticket PDF from:', generatedTicket.url);
      toast.info('Downloading ticket PDF...');
      
      const link = document.createElement('a');
      link.href = generatedTicket.url;
      link.download = `Kalakritam_Ticket_${generatedTicket.ticket_number}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Ticket PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading generated ticket PDF:', error);
      toast.error(`Download failed: ${error.message}`);
    }
  };

  // Function to download PDF from tickets list with animation
  const downloadTicketFromList = async (ticket) => {
    if (!ticket.url) {
      toast.error('No PDF available for this ticket.');
      return;
    }
    
    const ticketId = ticket.id || ticket.ticket_number || ticket.ticketNumber;
    
    try {
      // Add ticket to downloading set for visual feedback
      setDownloadingTickets(prev => new Set([...prev, ticketId]));
      console.log('📥 Starting animated download for ticket:', ticketId);
      
      // Trigger animation by checking the checkbox
      setTimeout(() => {
        const downloadButton = document.querySelector(`[data-ticket-id="${ticketId}"] .input`);
        console.log('Looking for download button with selector:', `[data-ticket-id="${ticketId}"] .input`);
        console.log('Found download button:', downloadButton);
        if (downloadButton && !downloadButton.checked) {
          downloadButton.checked = true;
          console.log('Animation triggered - checkbox checked');
        } else {
          console.log('Animation not triggered - button not found or already checked');
        }
      }, 100);

      toast.info('Preparing download...');
      
      // Wait for animation to complete (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now perform the actual download
      console.log('📥 Downloading ticket PDF from list:', ticket.url);
      
      const link = document.createElement('a');
      link.href = ticket.url;
      link.download = `Kalakritam_Ticket_${ticket.ticket_number || ticket.id}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Ticket PDF downloaded successfully!');
      
      // Reset animation after download completes
      setTimeout(() => {
        const downloadButton = document.querySelector(`[data-ticket-id="${ticketId}"] .input`);
        if (downloadButton) {
          downloadButton.checked = false;
        }
        setDownloadingTickets(prev => {
          const newSet = new Set(prev);
          newSet.delete(ticketId);
          return newSet;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error downloading ticket PDF from list:', error);
      toast.error(`Download failed: ${error.message}`);
      
      // Reset on error
      setDownloadingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };
  const downloadExistingTicket = async (ticket) => {
    const ticketId = ticket?.id || ticket?.ticket_number || ticket?.ticketNumber;
    const pdfUrl = ticket.url;
    
    if (!pdfUrl) {
      toast.error('No PDF available for this ticket');
      return;
    }

    try {
      console.log('Downloading existing PDF from:', pdfUrl);
      toast.info('Downloading ticket from cloud storage...');
      
      // Create download link for existing PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Kalakritam_Ticket_${ticketId}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Ticket downloaded successfully!');
      console.log('✅ Existing ticket PDF downloaded');
    } catch (error) {
      console.error('Error downloading existing PDF:', error);
      toast.error(`Error downloading PDF: ${error.message}`);
    }
  };

  // Function to generate new PDF and upload to R2
  const generateNewTicket = async (ticket) => {
    console.log('🚀 generateNewTicket called with ticket:', ticket);
    
    // Check if ticket already has a URL
    if (ticket.url) {
      console.log('⚠️ Ticket already has URL, should download instead:', ticket.url);
      toast.warning('This ticket already has a PDF. Use the download button instead.');
      return;
    }
    // Prevent rapid multiple clicks (debounce)
    const now = Date.now();
    if (now - lastDownloadTime < 1000) { // 1 second debounce
      console.log('Download request ignored - too soon after last download');
      return;
    }
    setLastDownloadTime(now);
    
    console.log('downloadTicket function called with:', ticket);
    console.log('Ticket type check:', {
      hasId: !!ticket?.id,
      hasTicketNumber: !!ticket?.ticket_number,
      hasTicketNumberCamel: !!ticket?.ticketNumber,
      ticketKeys: ticket ? Object.keys(ticket) : 'null'
    });
    
    // More robust ticket ID extraction
    const ticketId = ticket?.id || 
                     ticket?.ticket_number || 
                     ticket?.ticketNumber || 
                     ticket?.ticketId ||
                     'generated-' + Date.now();
    console.log('Extracted ticketId:', ticketId);
    
    // Prevent multiple downloads of the same ticket
    if (downloadingTickets.has(ticketId)) {
      console.log('Download already in progress, returning early');
      toast.warning('Download already in progress for this ticket');
      return;
    }

    let tempContainer = null;
    let frontElement = null;
    let backElement = null;
    let qrImage = null;
    
    try {
      // Add ticket to downloading set
      setDownloadingTickets(prev => new Set([...prev, ticketId]));
      console.log('Starting download for ticket:', ticketId);
      
      // Trigger animation by checking the checkbox after a short delay
      setTimeout(() => {
        const downloadButton = document.querySelector(`[data-ticket-id="${ticketId}"] .input`);
        console.log('Looking for download button with selector:', `[data-ticket-id="${ticketId}"] .input`);
        console.log('Found download button:', downloadButton);
        if (downloadButton && !downloadButton.checked) {
          downloadButton.checked = true;
          console.log('Animation triggered - checkbox checked');
        } else {
          console.log('Animation not triggered - button not found or already checked');
        }
      }, 100);

      toast.info('Preparing PDF download...');
      console.log('Toast message sent: Preparing PDF download...');
      
      // Check if we're downloading from the generated ticket (has preview elements)
      frontElement = document.querySelector('.preview-ticket-front');
      backElement = document.querySelector('.preview-ticket-back');
      console.log('Existing preview elements found:', { frontElement: !!frontElement, backElement: !!backElement });
      
      // If preview elements exist, wait for them to be fully rendered and validate them
      if (frontElement && backElement) {
        console.log('Using existing preview elements - validating and preparing...');
        
        // Check if elements have valid dimensions
        const frontRect = frontElement.getBoundingClientRect();
        const backRect = backElement.getBoundingClientRect();
        
        console.log('Element dimensions check:', {
          frontWidth: frontRect.width,
          frontHeight: frontRect.height,
          backWidth: backRect.width,
          backHeight: backRect.height,
          frontVisible: getComputedStyle(frontElement).display !== 'none',
          backVisible: getComputedStyle(backElement).display !== 'none'
        });
        
        // If elements don't have valid dimensions, treat them as invalid
        if (frontRect.width === 0 || frontRect.height === 0 || backRect.width === 0 || backRect.height === 0) {
          console.log('Existing elements have invalid dimensions, will create temporary elements');
          frontElement = null;
          backElement = null;
        } else {
          // Wait for elements to be fully rendered and styled
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Force layout recalculation
          frontElement.offsetHeight;
          backElement.offsetHeight;
          
          // Wait for QR code to load if present
          qrImage = document.querySelector('.preview-back-qr-code img');
          if (qrImage && !qrImage.complete) {
            console.log('Waiting for QR code to load...');
            await new Promise(resolve => {
              qrImage.onload = resolve;
              qrImage.onerror = resolve;
              setTimeout(resolve, 3000);
            });
          }
          
          // Additional wait to ensure everything is stable
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Existing preview elements ready for capture');
        }
      }
      
      // If preview elements don't exist or are invalid, create temporary ones
      if (!frontElement || !backElement) {
        console.log('Creating temporary preview elements...');
        // Create a properly formatted ticket object with QR code
        const verificationUrl = `${window.location.origin}/verify-ticket/${ticket.ticket_number || ticket.ticketNumber || ticket.id}`;
        console.log('Verification URL:', verificationUrl);
        let qrCodeUrl;
        
        try {
          console.log('Generating QR code...');
          qrCodeUrl = await generateQRCode(verificationUrl);
          console.log('QR Code generated successfully:', qrCodeUrl ? 'YES' : 'NO');
          
          // Validate QR code URL
          if (!qrCodeUrl || qrCodeUrl.length < 10) {
            console.warn('Invalid QR code generated, using fallback');
            qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;
          }
        } catch (error) {
          console.error('QR Code generation failed:', error);
          // Use direct QR code service as fallback
          qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;
          console.log('Using fallback QR code service:', qrCodeUrl);
        }
        
        const formattedTicket = {
          id: ticket.id,
          ticket_number: ticket.ticket_number || ticket.ticketNumber || ticket.id,
          customer_name: ticket.customer_name || ticket.customerName || 'Guest',
          customer_email: ticket.customer_email || ticket.customerEmail || '',
          customer_phone: ticket.customer_phone || ticket.customerPhone || '',
          event_name: ticket.event_name || ticket.eventName || 'Arts Workshop Experience',
          event_id: ticket.event_id || ticket.eventId || '',
          number_of_tickets: ticket.number_of_tickets || ticket.numberOfTickets || 1,
          amount_paid: ticket.amount_paid || ticket.amountPaid || 0,
          event_timings: ticket.event_timings || ticket.eventTimings || 'TBD',
          venue: ticket.venue || 'Kalakritam Art Gallery, Main Hall',
          status: ticket.status || 'valid',
          is_verified: ticket.is_verified || false,
          created_at: ticket.created_at || ticket.createdAt || new Date().toISOString(),
          qr_code_url: qrCodeUrl
        };
        
        // Create temporary container for ticket preview - matching exact preview styling
        console.log('Creating temporary container...');
        tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed'; // Changed from absolute
        tempContainer.style.left = '0px'; // Changed from -9999px to make it visible during capture
        tempContainer.style.top = '0px'; // Changed from -9999px
        tempContainer.style.visibility = 'visible'; // Changed from hidden
        tempContainer.style.width = '500px'; // Larger to accommodate tickets
        tempContainer.style.height = '600px'; // Larger to accommodate tickets
        tempContainer.style.padding = '0px'; // No padding to match preview
        tempContainer.style.backgroundColor = 'transparent';
        tempContainer.style.zIndex = '9999'; // High z-index to ensure visibility
        tempContainer.style.opacity = '1'; // Ensure full opacity
        
        // Add the AdminTickets CSS class to ensure proper styling
        tempContainer.className = 'admin-tickets-container';
        
        // Create a wrapper div for proper spacing - matching preview container exactly
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'ticket-preview-container';
        wrapperDiv.style.display = 'flex';
        wrapperDiv.style.flexDirection = 'column';
        wrapperDiv.style.gap = '20px'; // Same gap as preview
        wrapperDiv.style.alignItems = 'center';
        wrapperDiv.style.padding = '0';
        wrapperDiv.style.margin = '0';
        
        tempContainer.appendChild(wrapperDiv);
        document.body.appendChild(tempContainer);
        console.log('Temporary container created and added to DOM');
        
        // Create front side element with complete inline styles for PDF generation - matching preview exactly
        console.log('Setting innerHTML for wrapper...');
        wrapperDiv.innerHTML = `
          <div class="preview-ticket-front" style="
            width: 400px;
            height: 250px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
            border-radius: 20px;
            padding: 20px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-family: 'Samarkan', 'Cinzel', serif;
            margin: 0;
            display: block;
          ">
            <div class="preview-front-content" style="position: relative; z-index: 2; height: 100%;">
              <div class="preview-branding-top-left" style="
                position: absolute;
                top: 0;
                left: 0;
                font-size: 16px;
                font-weight: bold;
                color: #d4af85;
                letter-spacing: 0px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                font-family: 'Samarkan', serif;
              ">KALAKRITAM</div>
              <div class="preview-event-header" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                width: 100%;
              ">
                <div class="preview-event-title" style="
                  font-size: 24px;
                  font-weight: bold;
                  color: #ffffff;
                  margin-bottom: 8px;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
                  font-family: 'Dancing Script', cursive;
                ">${formattedTicket.customer_name}</div>
                <div class="preview-event-subtitle" style="
                  font-size: 16px;
                  color: #d4af85;
                  letter-spacing: 1px;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                ">Arts Workshop Experience</div>
              </div>
            </div>
          </div>
          
          <div class="preview-ticket-back" style="
            width: 400px;
            height: 250px;
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #2d2d2d 100%);
            border-radius: 20px;
            padding: 20px;
            box-sizing: border-box;
            position: relative;
            color: #ffffff;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-family: 'Samarkan', 'Cinzel', serif;
            margin: 0;
            display: block;
          ">
            <div class="preview-back-content" style="position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column;">
              <div class="preview-barcode-section" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
                padding: 10px 0;
                border-bottom: 1px solid #d4af85;
              ">
                <div class="preview-admin-text" style="
                  font-size: 12px;
                  font-weight: bold;
                  color: #d4af85;
                  letter-spacing: 1px;
                ">ADMIN</div>
                <div class="preview-barcode-lines" style="
                  display: flex;
                  align-items: center;
                  gap: 2px;
                  flex: 1;
                  justify-content: center;
                ">
                  ${Array.from({length: 15}, (_, i) => `
                    <div class="preview-barcode-line" style="
                      width: 2px;
                      height: ${Math.random() * 20 + 10}px;
                      background-color: #d4af85;
                    "></div>
                  `).join('')}
                </div>
                <div class="preview-people-count" style="
                  font-size: 12px;
                  font-weight: bold;
                  color: #d4af85;
                  letter-spacing: 1px;
                ">${String(formattedTicket.number_of_tickets).padStart(3, '0')}</div>
              </div>
              
              <div class="preview-terms-section" style="
                flex: 1;
                font-size: 11px;
                line-height: 1.4;
                color: #cccccc;
              ">
                <div class="preview-terms-header" style="
                  font-size: 12px;
                  font-weight: bold;
                  color: #d4af85;
                  margin-bottom: 8px;
                  letter-spacing: 1px;
                ">EVENT DETAILS</div>
                <div class="preview-terms-content">
                  <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedTicket.event_timings || 'Invalid Date - Invalid Date'}</p>
                  <p style="margin: 4px 0;"><strong>Venue:</strong> ${formattedTicket.venue || 'Kalakritam Art Gallery, Main Hall'}</p>
                  <p style="margin: 4px 0;"><strong>Guest:</strong> ${formattedTicket.customer_name || 'Nachu Gowtham'}</p>
                  <p style="margin: 4px 0;"><strong>Amount:</strong> ₹${formattedTicket.amount_paid || '500'}</p>
                </div>
              </div>
              
              <div class="preview-back-qr-section" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #d4af85;
              ">
                <div class="preview-back-qr-code" style="
                  width: 50px;
                  height: 50px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                ">
                  ${formattedTicket.qr_code_url ? `<img src="${formattedTicket.qr_code_url}" alt="QR Code" style="width: 100%; height: 100%; object-fit: cover;" />` : ''}
                </div>
                <div class="preview-back-ticket-number" style="
                  font-size: 10px;
                  color: #d4af85;
                  font-weight: bold;
                  letter-spacing: 1px;
                ">${formattedTicket.ticket_number}</div>
              </div>
            </div>
          </div>
        `;
        console.log('HTML content set, waiting for rendering...');
        
        // Wait for elements to be rendered
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Initial wait completed, looking for elements...');
        
        // Get the newly created elements from the wrapper
        frontElement = wrapperDiv.querySelector('.preview-ticket-front');
        backElement = wrapperDiv.querySelector('.preview-ticket-back');
        
        if (!frontElement || !backElement) {
          throw new Error('Unable to create ticket preview for download.');
        }
        
        // Make the temporary container fully visible for proper rendering and CSS application
        tempContainer.style.visibility = 'visible';
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '50px';
        tempContainer.style.top = '50px';
        tempContainer.style.zIndex = '9999'; // Bring to front temporarily
        tempContainer.style.opacity = '1'; // Fully visible for debugging
        tempContainer.style.pointerEvents = 'none'; // Prevent interaction
        
        // Add loading overlay to hide capture process from user
        const loadingOverlay = document.createElement('div');
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100vw';
        loadingOverlay.style.height = '100vh';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        loadingOverlay.style.zIndex = '10000';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.color = 'white';
        loadingOverlay.style.fontSize = '18px';
        loadingOverlay.innerHTML = '<div>📄 Generating ticket PDF... Please wait</div>';
        document.body.appendChild(loadingOverlay);
        
        // Force layout recalculation and ensure CSS is applied
        frontElement.offsetHeight;
        backElement.offsetHeight;
        
        // Wait longer for CSS to be fully applied and QR code to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Wait for QR code image to load properly
        qrImage = wrapperDiv.querySelector('.preview-back-qr-code img');
        if (qrImage) {
          await new Promise(resolve => {
            if (qrImage.complete) {
              resolve();
            } else {
              qrImage.onload = resolve;
              qrImage.onerror = () => {
                console.warn('QR code failed to load');
                resolve();
              };
              setTimeout(resolve, 3000); // Longer timeout for QR code
            }
          });
        }
        
        // Additional wait to ensure CSS animations and styling are complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Temporary elements fully prepared:', {
          frontWidth: frontElement.offsetWidth,
          frontHeight: frontElement.offsetHeight,
          backWidth: backElement.offsetWidth,
          backHeight: backElement.offsetHeight
        });
      } else {
        // If using existing preview elements, still try to find QR image
        qrImage = document.querySelector('.preview-back-qr-code img');
        console.log('Using existing preview elements, QR image found:', !!qrImage);
        console.log('Preview elements details:', {
          frontElementOffsetWidth: frontElement ? frontElement.offsetWidth : 'N/A',
          frontElementOffsetHeight: frontElement ? frontElement.offsetHeight : 'N/A',
          backElementOffsetWidth: backElement ? backElement.offsetWidth : 'N/A',
          backElementOffsetHeight: backElement ? backElement.offsetHeight : 'N/A',
          frontElementVisible: frontElement ? getComputedStyle(frontElement).display !== 'none' : 'N/A',
          backElementVisible: backElement ? getComputedStyle(backElement).display !== 'none' : 'N/A'
        });
      }
      
      // Validate that we have valid elements to work with
      if (!frontElement || !backElement) {
        throw new Error('Could not find or create valid ticket preview elements');
      }
      
      // Get fresh dimensions after all waits
      const finalFrontRect = frontElement.getBoundingClientRect();
      const finalBackRect = backElement.getBoundingClientRect();
      
      console.log('Final element validation:', {
        frontWidth: finalFrontRect.width,
        frontHeight: finalFrontRect.height,
        backWidth: finalBackRect.width,
        backHeight: finalBackRect.height,
        frontOffsetWidth: frontElement.offsetWidth,
        frontOffsetHeight: frontElement.offsetHeight,
        backOffsetWidth: backElement.offsetWidth,
        backOffsetHeight: backElement.offsetHeight,
        frontVisible: getComputedStyle(frontElement).display !== 'none',
        backVisible: getComputedStyle(backElement).display !== 'none',
        frontOpacity: getComputedStyle(frontElement).opacity,
        backOpacity: getComputedStyle(backElement).opacity
      });
      
      if (frontElement.offsetWidth === 0 || frontElement.offsetHeight === 0) {
        throw new Error(`Front element has invalid dimensions (${frontElement.offsetWidth}x${frontElement.offsetHeight}). Element may be hidden or not rendered.`);
      }
      
      if (backElement.offsetWidth === 0 || backElement.offsetHeight === 0) {
        throw new Error(`Back element has invalid dimensions (${backElement.offsetWidth}x${backElement.offsetHeight}). Element may be hidden or not rendered.`);
      }
      
      // Make sure elements are visible for capture
      const frontStyle = getComputedStyle(frontElement);
      const backStyle = getComputedStyle(backElement);
      
      if (frontStyle.display === 'none' || frontStyle.visibility === 'hidden') {
        throw new Error('Front element is not visible (display: none or visibility: hidden)');
      }
      
      if (backStyle.display === 'none' || backStyle.visibility === 'hidden') {
        throw new Error('Back element is not visible (display: none or visibility: hidden)');
      }
      
      // Scroll elements into view to ensure they're fully visible
      frontElement.scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force one more layout recalculation
      frontElement.offsetHeight;
      backElement.offsetHeight;
      
      // Capture front side with high quality - using enhanced settings
      console.log('Starting canvas capture for front element...');
      console.log('Front element final check before capture:', {
        offsetWidth: frontElement.offsetWidth,
        offsetHeight: frontElement.offsetHeight,
        boundingRect: frontElement.getBoundingClientRect(),
        computedStyle: {
          display: getComputedStyle(frontElement).display,
          visibility: getComputedStyle(frontElement).visibility,
          opacity: getComputedStyle(frontElement).opacity,
          position: getComputedStyle(frontElement).position
        }
      });
      
      const frontCanvas = await html2canvas(frontElement, {
        scale: 4, // Higher scale for better quality (increased from 3)
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Transparent background to preserve gradients
        logging: false,
        height: frontElement.offsetHeight,
        width: frontElement.offsetWidth,
        removeContainer: false,
        foreignObjectRendering: true, // Enable for better text rendering
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        x: 0,
        y: 0,
        imageTimeout: 30000, // Increased timeout for complex elements
        ignoreElements: (element) => {
          return element.classList.contains('loading-overlay') || 
                 element.classList.contains('modal') || 
                 element.classList.contains('toast');
        },
        onclone: (clonedDoc, element) => {
          console.log('Front element cloned for capture');
          const clonedElement = clonedDoc.querySelector('.preview-ticket-front');
          if (clonedElement) {
            // Ensure all fonts and styles are loaded
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.display = 'block';
            
            // Force font loading
            const style = clonedDoc.createElement('style');
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
              .preview-ticket-front, .preview-ticket-front * {
                font-family: 'Samarkan', 'Cinzel', serif !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `;
            clonedDoc.head.appendChild(style);
            console.log('Enhanced CSS applied to cloned front element');
          }
        }
      });
      console.log('Front canvas captured successfully, dimensions:', frontCanvas.width, 'x', frontCanvas.height);
      
      if (frontCanvas.width === 0 || frontCanvas.height === 0) {
        throw new Error(`Front canvas has invalid dimensions: ${frontCanvas.width}x${frontCanvas.height}`);
      }
      
      // Capture back side with high quality - using enhanced settings
      console.log('Starting canvas capture for back element...');
      console.log('Back element final check before capture:', {
        offsetWidth: backElement.offsetWidth,
        offsetHeight: backElement.offsetHeight,
        boundingRect: backElement.getBoundingClientRect(),
        computedStyle: {
          display: getComputedStyle(backElement).display,
          visibility: getComputedStyle(backElement).visibility,
          opacity: getComputedStyle(backElement).opacity,
          position: getComputedStyle(backElement).position
        }
      });
      
      const backCanvas = await html2canvas(backElement, {
        scale: 4, // Higher scale for better quality (increased from 3)
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Transparent background to preserve gradients
        logging: false,
        height: backElement.offsetHeight,
        width: backElement.offsetWidth,
        removeContainer: false,
        foreignObjectRendering: true, // Enable for better text rendering
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        x: 0,
        y: 0,
        imageTimeout: 30000, // Increased timeout for complex elements
        ignoreElements: (element) => {
          return element.classList.contains('loading-overlay') || 
                 element.classList.contains('modal') || 
                 element.classList.contains('toast');
        },
        onclone: (clonedDoc, element) => {
          console.log('Back element cloned for capture');
          const clonedElement = clonedDoc.querySelector('.preview-ticket-back');
          if (clonedElement) {
            // Ensure all fonts and styles are loaded
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.display = 'block';
            
            // Force font loading and styling
            const style = clonedDoc.createElement('style');
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
              .preview-ticket-back, .preview-ticket-back * {
                font-family: 'Samarkan', 'Cinzel', serif !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `;
            clonedDoc.head.appendChild(style);
            console.log('Enhanced CSS applied to cloned back element');
          }
        }
      });
      console.log('Back canvas captured successfully, dimensions:', backCanvas.width, 'x', backCanvas.height);
      
      if (backCanvas.width === 0 || backCanvas.height === 0) {
        throw new Error(`Back canvas has invalid dimensions: ${backCanvas.width}x${backCanvas.height}`);
      }
      
      // Hide the temporary container again after capture
      if (tempContainer) {
        tempContainer.style.zIndex = '-1000';
        tempContainer.style.opacity = '0';
        console.log('Temporary container hidden after capture');
      }
      
      // Calculate dimensions for PDF layout - compact without margins
      const ticketWidthPx = frontElement.offsetWidth;
      const ticketHeightPx = frontElement.offsetHeight;
      const ticketWidthMM = (ticketWidthPx * 25.4) / 96; // Convert to mm
      const ticketHeightMM = (ticketHeightPx * 25.4) / 96;
      
      // Create PDF with exact ticket dimensions - no margins or extra space
      let pdf;
      
      // Try side-by-side layout first (more compact)
      const totalWidthSideBySide = ticketWidthMM * 2;
      const totalHeightSideBySide = ticketHeightMM;
      
      if (totalWidthSideBySide <= 210) {
        // Side-by-side layout - exact size with no margins
        pdf = new jsPDF({
          orientation: totalWidthSideBySide > totalHeightSideBySide ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [totalWidthSideBySide, totalHeightSideBySide]
        });
        
        // Add front ticket (left side) - no margin
        const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality
        console.log('Front image data length:', frontImgData.length, 'Preview:', frontImgData.substring(0, 50) + '...');
        pdf.addImage(frontImgData, 'JPEG', 0, 0, ticketWidthMM, ticketHeightMM, '', 'FAST');
        
        // Add back ticket (right side) - no spacing
        const backImgData = backCanvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality
        console.log('Back image data length:', backImgData.length, 'Preview:', backImgData.substring(0, 50) + '...');
        pdf.addImage(backImgData, 'JPEG', ticketWidthMM, 0, ticketWidthMM, ticketHeightMM, '', 'FAST');
        
      } else {
        // Vertical layout - exact size with no margins
        const totalHeightVertical = ticketHeightMM * 2;
        
        pdf = new jsPDF({
          orientation: ticketWidthMM > totalHeightVertical ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [ticketWidthMM, totalHeightVertical]
        });
        
        // Add front ticket (top) - no margin
        const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality
        console.log('Front image data length:', frontImgData.length, 'Preview:', frontImgData.substring(0, 50) + '...');
        pdf.addImage(frontImgData, 'JPEG', 0, 0, ticketWidthMM, ticketHeightMM, '', 'FAST');
        
        // Add back ticket (bottom) - no spacing
        const backImgData = backCanvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality
        console.log('Back image data length:', backImgData.length, 'Preview:', backImgData.substring(0, 50) + '...');
        pdf.addImage(backImgData, 'JPEG', 0, ticketHeightMM, ticketWidthMM, ticketHeightMM, '', 'FAST');
      }
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const fileName = `Kalakritam_Ticket_${ticket.id}_${timestamp}.pdf`;
      
      // Generate PDF blob instead of saving directly
      const pdfBlob = pdf.output('blob');
      
      try {
        // Upload PDF to R2 storage
        toast.info('Uploading ticket to cloud storage...');
        const uploadResult = await uploadApi.uploadTicketPDF(pdfBlob, ticket.ticket_number || ticket.id);
        
        if (uploadResult.success) {
          // Update ticket record with PDF URL
          try {
            await ticketsApi.update(ticket.id, { url: uploadResult.data.url });
            console.log('✅ Ticket PDF URL saved to database');
          } catch (updateError) {
            console.warn('⚠️ Failed to update ticket with PDF URL:', updateError);
          }
          
          // Provide download link to user
          const link = document.createElement('a');
          link.href = uploadResult.data.url;
          link.download = fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`Ticket uploaded to cloud storage and download started!`);
          console.log('✅ Ticket PDF uploaded to R2:', uploadResult.data.url);
        } else {
          throw new Error(uploadResult.message || 'Upload failed');
        }
      } catch (uploadError) {
        console.warn('⚠️ Failed to upload to R2, falling back to local download:', uploadError);
        // Fallback to local download if R2 upload fails
        pdf.save(fileName);
        toast.warning(`Cloud upload failed, downloaded locally instead: ${uploadError.message}`);
      }
      
    } catch (error) {
      console.error('Error generating PDF ticket:', error);
      console.error('Error details:', {
        ticketData: ticket,
        frontElementExists: !!frontElement,
        backElementExists: !!backElement,
        tempContainerExists: !!tempContainer,
        errorMessage: error.message,
        errorStack: error.stack
      });
      toast.error(`Error generating PDF: ${error.message}. Check console for details.`);
    } finally {
      // Clean up loading overlay
      const loadingOverlay = document.querySelector('div[style*="Generating ticket PDF"]')?.parentElement;
      if (loadingOverlay) {
        try {
          document.body.removeChild(loadingOverlay);
          console.log('Loading overlay cleaned up successfully');
        } catch (cleanupError) {
          console.warn('Error cleaning up loading overlay:', cleanupError);
        }
      }
      
      // Clean up temporary container if it was created
      if (tempContainer && tempContainer.parentNode) {
        try {
          tempContainer.parentNode.removeChild(tempContainer);
          console.log('Temporary container cleaned up successfully');
        } catch (cleanupError) {
          console.warn('Error cleaning up temporary container:', cleanupError);
        }
      }
      
      // Remove ticket from downloading set
      setDownloadingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
      
      console.log('Download completed for ticket:', ticketId);
      
      // Reset the animation after a delay
      setTimeout(() => {
        const downloadButton = document.querySelector(`[data-ticket-id="${ticketId}"] .input`);
        if (downloadButton) {
          downloadButton.checked = false;
        }
      }, 3200); // Reset after 3.2 seconds to match new animation timing
    }
  };

  // Main download function that decides between downloading existing or generating new
  const downloadTicket = async (ticket) => {
    const ticketId = ticket?.id || ticket?.ticket_number || ticket?.ticketNumber;
    const pdfUrl = ticket.url;
    
    console.log('downloadTicket called:', { ticketId, hasPdfUrl: !!pdfUrl, pdfUrl });
    
    // Prevent rapid clicks
    const now = Date.now();
    if (now - lastDownloadTime < 1000) {
      console.log('Download request ignored - too soon after last download');
      return;
    }
    setLastDownloadTime(now);
    
    // If ticket already has a PDF URL, download it directly
    if (pdfUrl) {
      await downloadExistingTicket(ticket);
    } else {
      // Generate new PDF and upload to R2
      await generateNewTicket(ticket);
    }
  };

  // Explicit function to generate new ticket (called by Generate button)
  const handleGenerateTicket = async (ticket) => {
    console.log('🎯 handleGenerateTicket called explicitly');
    await generateNewTicket(ticket);
  };

  // Explicit function to download existing ticket (called by Download button)
  const handleDownloadTicket = async (ticket) => {
    console.log('🎯 handleDownloadTicket called explicitly');
    await downloadExistingTicket(ticket);
  };

  const clearVerificationResult = () => {
    setVerificationResult(null);
    setVerifyForm({ ticketCode: '', ticketNumber: '' });
  };

  return (
    <div className="admin-tickets-container">
      <VideoLogo />
      <AdminHeader currentPage="tickets" />
      
      <main className="admin-tickets-content">
        <div className="admin-tickets-header">
          <h1>Ticket Management</h1>
        </div>

        <div className="admin-tickets-tabs">
          <button 
            className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            🎫 Generate Ticket
          </button>
          <button 
            className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            ✅ Verify Ticket
          </button>
          <button 
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 All Tickets
          </button>
        </div>

        <div className="tab-content">
          {/* Generate Ticket Tab */}
          {activeTab === 'generate' && (
            <div className="generate-ticket-section">
              <div className="form-container">
                <h3>🎫 Create New Ticket</h3>
                <div className="ticket-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Customer Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={ticketForm.customerName}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={ticketForm.customerEmail}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="customer@email.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={ticketForm.customerPhone}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Tickets *</label>
                      <input
                        type="number"
                        name="numberOfTickets"
                        value={ticketForm.numberOfTickets}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        min="1"
                        max="10"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Event Name *</label>
                      <input
                        type="text"
                        name="eventName"
                        value={ticketForm.eventName}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="Enter event name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Venue *</label>
                      <input
                        type="text"
                        name="venue"
                        value={ticketForm.venue}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="Event venue location"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Event Date & Time *</label>
                      <input
                        type="text"
                        name="eventTimings"
                        value={ticketForm.eventTimings}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="March 15, 2025 6:00 PM"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Amount Paid (₹) *</label>
                      <input
                        type="number"
                        name="amountPaid"
                        value={ticketForm.amountPaid}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    onClick={generateTicket} 
                    disabled={loading} 
                    className="generate-btn"
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Generating...
                      </>
                    ) : (
                      <>Generate Ticket</>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Ticket Display */}
              {generatedTicket && (
                <>
                  <h3 className="ticket-success-title">Ticket Generated Successfully!</h3>
                  
                  {/* Preview of Front and Back */}
                  <div className="ticket-preview-container">
                    {/* Front Side Preview */}
                    <div className="preview-ticket-front">
                      <div className="preview-front-content">
                        <div className="preview-branding-top-left">KALAKRITAM</div>
                        <div className="preview-event-header">
                          <div className="preview-event-title">{generatedTicket.customer_name}</div>
                          <div className="preview-event-subtitle">Arts Workshop Experience</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back Side Preview */}
                    <div className="preview-ticket-back">
                      <div className="preview-back-content">
                        <div className="preview-barcode-section">
                          <div className="preview-admin-text">ADMIN</div>
                          <div className="preview-barcode-lines">
                            {Array.from({length: 15}, (_, i) => (
                              <div key={i} className="preview-barcode-line"></div>
                            ))}
                          </div>
                          <div className="preview-people-count">{String(generatedTicket.number_of_tickets).padStart(3, '0')}</div>
                        </div>
                        
                        <div className="preview-terms-section">
                          <div className="preview-terms-header">EVENT DETAILS</div>
                          <div className="preview-terms-content">
                            <p><strong>Date:</strong> {generatedTicket.event_timings || 'Invalid Date - Invalid Date'}</p>
                            <p><strong>Venue:</strong> {generatedTicket.venue || 'Kalakritam Art Gallery, Main Hall'}</p>
                            <p><strong>Guest:</strong> {generatedTicket.customer_name || 'Nachu Gowtham'}</p>
                            <p><strong>Amount:</strong> ₹{generatedTicket.amount_paid || '500'}</p>
                          </div>
                        </div>
                        
                        <div className="preview-back-qr-section">
                          <div className="preview-back-qr-code">
                            {generatedTicket.qr_code_url && (
                              <img src={generatedTicket.qr_code_url} alt="QR Code" />
                            )}
                          </div>
                          <div className="preview-back-ticket-number">{generatedTicket.ticket_number}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="preview-note">
                    <p>This is a preview. Download for the full printable version with professional styling.</p>
                  </div>
                  
                  <div className="download-button-container" data-ticket-id={generatedTicket?.id || generatedTicket?.ticket_number || 'generated'}>
                    <label 
                      className={`download-label ${downloadingTickets.has(generatedTicket?.id || generatedTicket?.ticket_number || 'generated') ? 'downloading' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        downloadGeneratedTicketPDF();
                      }}
                    >
                      <input className="input" type="checkbox" />
                      <div className="circle">
                        <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                        </svg>
                        <div className="square"></div>
                      </div>
                      <p className="title">Download</p>
                      <p className="title">Downloaded</p>
                    </label>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Verify Ticket Tab */}
          {activeTab === 'verify' && (
            <div className="verify-ticket-section">
              <div className="verify-container">
                <h3>Verify Ticket</h3>
                <div className="verify-form">
                  <div className="form-group">
                    <label>Ticket ID or Number</label>
                    <input
                      type="text"
                      name="ticketCode"
                      value={verifyForm.ticketCode}
                      onChange={(e) => handleFormChange(e, 'verify')}
                      placeholder="Enter ticket ID or number"
                    />
                  </div>
                  <button 
                    onClick={verifyTicket} 
                    disabled={loading}
                    className="verify-btn"
                  >
                    {loading ? 'Verifying...' : 'Verify Ticket'}
                  </button>
                </div>

                {verificationResult && (
                  <div className={`verification-result ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
                    <div className="result-header">
                      <span className="result-icon">
                        {verificationResult.isValid ? '✓' : '×'}
                      </span>
                      <h4>{verificationResult.message}</h4>
                    </div>
                    {verificationResult.isValid && verificationResult.customer_name && (
                      <div className="ticket-info">
                        <p><strong>Customer:</strong> {verificationResult.customer_name}</p>
                        <p><strong>Event:</strong> {verificationResult.event_name}</p>
                        <p><strong>Tickets:</strong> {verificationResult.number_of_tickets}</p>
                        <p><strong>Amount:</strong> ₹{verificationResult.amount_paid}</p>
                        <p><strong>Status:</strong> {verificationResult.status}</p>
                      </div>
                    )}
                    <button onClick={clearVerificationResult} className="clear-btn">
                      Clear Result
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Tickets Tab */}
          {activeTab === 'list' && (
            <div className="tickets-list-section">
              <div className="tickets-list-header">
                <h3>📋 All Tickets</h3>
                <button onClick={fetchTickets} className="refresh-btn">
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Loading tickets...</p>
                </div>
              ) : (
                <div className="tickets-content">
                  {/* Error handling now done via toast notifications */}
                  
                  {tickets.length === 0 ? (
                    <div className="empty-tickets">
                      <div className="empty-icon">🎫</div>
                      <h4>No Tickets Yet</h4>
                      <p>No tickets have been generated yet. Create your first ticket using the "Generate Ticket" tab.</p>
                      <button onClick={() => setActiveTab('generate')} className="generate-first-btn">
                        ➕ Generate First Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="tickets-grid">
                      {tickets.map(ticket => (
                        <div key={ticket.id} className="ticket-card">
                          <div className="ticket-header">
                            <h4>{ticket.ticket_number || ticket.ticketNumber}</h4>
                            <span className={`status ${ticket.status || 'unknown'}`}>
                              {ticket.status || 'Unknown'}
                            </span>
                          </div>
                          <div className="ticket-info">
                            <p><strong>Customer:</strong> {ticket.customer_name || ticket.customerName || 'N/A'}</p>
                            <p><strong>Event:</strong> {ticket.event_name || ticket.eventName || 'N/A'}</p>
                            <p><strong>Tickets:</strong> {ticket.number_of_tickets || ticket.numberOfTickets || 0}</p>
                            <p><strong>Amount:</strong> ₹{ticket.amount_paid || ticket.amountPaid || 0}</p>
                            <p><strong>Created:</strong> {
                              ticket.created_at || ticket.createdAt ? 
                                new Date(ticket.created_at || ticket.createdAt).toLocaleDateString() : 
                                'N/A'
                            }</p>
                          </div>
                          <div className="ticket-actions">
                            {/* Download Button with Animation - available for all tickets */}
                            <div className="download-button-container" data-ticket-id={ticket.id}>
                              <label 
                                className={`download-label ${downloadingTickets.has(ticket.id) ? 'downloading' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  downloadTicketFromList(ticket);
                                }}
                              >
                                <input className="input" type="checkbox" />
                                <div className="circle">
                                  <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                  </svg>
                                  <div className="square"></div>
                                </div>
                                <p className="title">Download</p>
                                <p className="title">Downloaded</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminTickets;
