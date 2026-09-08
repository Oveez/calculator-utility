import { jsPDF } from 'jspdf';

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  gpa: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  linkOrRole: string;
  description: string;
  tech: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface VolunteerItem {
  id: string;
  role: string;
  organization: string;
  details: string;
}

export interface CvState {
  template: 'professional' | 'modern' | 'student';
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificateItem[];
  languages: LanguageItem[];
  awards: AwardItem[];
  volunteer: VolunteerItem[];
  interests: string;
  references: string;
  photo?: string;
}

/**
 * Pure Vector Text-Based PDF Generator for CV & Resume Builder.
 * Produces crisp, 100% searchable, copyable, selectable, and ATS-compliant PDFs
 * with mathematical layout precision and zero text/line overlaps.
 */
export function generateCvPdf(data: CvState): jsPDF {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  });

  const template = data.template || 'professional';
  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 15;
  const marginRight = 15;
  const marginTop = 14;
  const marginBottom = 14;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const maxY = pageHeight - marginBottom;

  let currentY = marginTop;

  const isProfessional = template === 'professional';
  const isModern = template === 'modern';
  const isStudent = template === 'student';

  const primaryFont = isProfessional ? 'times' : 'helvetica';

  // Palette Configuration (RGB triplets)
  const colors = {
    primaryText: isModern ? [15, 23, 42] : isStudent ? [17, 24, 39] : [17, 24, 39],
    boldText: isModern ? [15, 23, 42] : isStudent ? [17, 24, 39] : [0, 0, 0],
    nameText: isModern ? [30, 58, 138] : isStudent ? [6, 78, 59] : [0, 0, 0],
    titleText: isModern ? [37, 99, 235] : isStudent ? [4, 120, 87] : [55, 65, 81],
    mutedText: isModern ? [71, 85, 105] : [55, 65, 81],
    lightMuted: isModern ? [100, 116, 139] : [75, 85, 99],
    sectionTitle: isModern ? [30, 58, 138] : isStudent ? [6, 78, 59] : [0, 0, 0],
    headerLine: isModern ? [30, 58, 138] : isStudent ? [6, 95, 70] : [17, 24, 39],
    sectionLine: isModern ? [219, 234, 254] : isStudent ? [167, 243, 208] : [17, 24, 39],
    pillBg: [241, 245, 249],
    pillBorder: [203, 213, 225],
    pillText: [30, 41, 59],
  };

  /**
   * Checks if required content height fits on the current page.
   * If not, adds a new page and resets currentY to marginTop.
   */
  function ensureSpace(requiredHeight: number): boolean {
    if (currentY + requiredHeight > maxY) {
      doc.addPage();
      currentY = marginTop;
      return true;
    }
    return false;
  }

  // =========================================================================
  // 1. HEADER SECTION
  // =========================================================================
  function renderHeader() {
    const name = (data.name || 'YOUR NAME').trim();
    const title = (data.title || '').trim();
    const contactItems = [
      data.email?.trim(),
      data.phone?.trim(),
      data.location?.trim(),
      data.linkedin?.trim(),
      data.website?.trim(),
    ].filter(Boolean) as string[];

    const hasPhoto = Boolean(data.photo && data.photo.trim().length > 0);

    if (hasPhoto) {
      const photoSize = 22; // mm (square standard headshot)
      const photoGap = 4.5; // mm
      const photoX = marginLeft;
      const photoY = currentY;

      // Render photo on the left margin
      try {
        const photoFormat = data.photo!.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(data.photo!, photoFormat, photoX, photoY, photoSize, photoSize);
      } catch (err) {
        console.error('Failed to embed profile photo in PDF:', err);
      }

      // Subtle border around photo matching template palette
      doc.setDrawColor(colors.headerLine[0], colors.headerLine[1], colors.headerLine[2]);
      doc.setLineWidth(0.25);
      doc.rect(photoX, photoY, photoSize, photoSize);

      // Text column cleanly aligned beside photo
      const textX = photoX + photoSize + photoGap;
      const textWidth = contentWidth - photoSize - photoGap;
      let textY = photoY + 0.5;

      // Name
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(isModern ? 19 : 18);
      doc.setTextColor(colors.nameText[0], colors.nameText[1], colors.nameText[2]);
      const nameToPrint = isProfessional ? name.toUpperCase() : name;
      doc.text(nameToPrint, textX, textY, { baseline: 'top' });
      textY += isModern ? 7.2 : 6.8;

      // Professional Title
      if (title) {
        doc.setFont(primaryFont, 'bold');
        doc.setFontSize(10.2);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text(title, textX, textY, { baseline: 'top' });
        textY += 4.5;
      }

      // Contact Details Line
      if (contactItems.length > 0) {
        doc.setFont(primaryFont, 'normal');
        doc.setFontSize(8.6);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);

        const contactStr = contactItems.join('   |   ');
        const wrappedContact = doc.splitTextToSize(contactStr, textWidth);

        wrappedContact.forEach((line: string) => {
          doc.text(line, textX, textY, { baseline: 'top' });
          textY += 3.8;
        });
      }

      // Advance currentY past both photo and text
      currentY = Math.max(photoY + photoSize, textY) + 2.5;

      // Header Divider Line across full content width
      doc.setDrawColor(colors.headerLine[0], colors.headerLine[1], colors.headerLine[2]);
      doc.setLineWidth(isModern ? 0.6 : 0.45);
      doc.line(marginLeft, currentY, marginLeft + contentWidth, currentY);
      currentY += isModern ? 3.8 : 3.2;
      return;
    }

    // Default Header without Photo (100% Backward Compatible)
    // Name
    doc.setFont(primaryFont, 'bold');
    doc.setFontSize(isModern ? 19 : 18);
    doc.setTextColor(colors.nameText[0], colors.nameText[1], colors.nameText[2]);

    const nameToPrint = isProfessional ? name.toUpperCase() : name;
    if (isModern) {
      doc.text(nameToPrint, marginLeft, currentY, { baseline: 'top' });
    } else {
      doc.text(nameToPrint, pageWidth / 2, currentY, { align: 'center', baseline: 'top' });
    }
    currentY += isModern ? 7.6 : 7.2;

    // Professional Title
    if (title) {
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(10.2);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      if (isModern) {
        doc.text(title, marginLeft, currentY, { baseline: 'top' });
      } else {
        doc.text(title, pageWidth / 2, currentY, { align: 'center', baseline: 'top' });
      }
      currentY += 4.8;
    }

    // Contact Details Line
    if (contactItems.length > 0) {
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);

      const contactStr = contactItems.join('   |   ');
      const wrappedContact = doc.splitTextToSize(contactStr, contentWidth);

      wrappedContact.forEach((line: string) => {
        if (isModern) {
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
        } else {
          doc.text(line, pageWidth / 2, currentY, { align: 'center', baseline: 'top' });
        }
        currentY += 3.8;
      });
      currentY += 0.5;
    }

    // Header Divider Line
    currentY += 1.2;
    doc.setDrawColor(colors.headerLine[0], colors.headerLine[1], colors.headerLine[2]);
    doc.setLineWidth(isModern ? 0.6 : 0.45);
    doc.line(marginLeft, currentY, marginLeft + contentWidth, currentY);
    currentY += isModern ? 3.8 : 3.2;
  }

  // =========================================================================
  // 2. SECTION TITLE WITH ORPHAN PREVENTION
  // =========================================================================
  function renderSectionTitle(titleText: string) {
    // Ensure section header + at least one line of entry fits on the page (min 15mm)
    ensureSpace(15);

    currentY += 1.6;
    doc.setFont(primaryFont, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.sectionTitle[0], colors.sectionTitle[1], colors.sectionTitle[2]);

    doc.text(titleText.toUpperCase(), marginLeft, currentY, { baseline: 'top' });
    currentY += 4.2;

    // Section underline
    doc.setDrawColor(colors.sectionLine[0], colors.sectionLine[1], colors.sectionLine[2]);
    doc.setLineWidth(isModern ? 0.45 : 0.28);
    doc.line(marginLeft, currentY, marginLeft + contentWidth, currentY);
    currentY += 2.8;
  }

  // =========================================================================
  // 3. PROFESSIONAL SUMMARY
  // =========================================================================
  function renderSummary() {
    const summary = (data.summary || '').trim();
    if (!summary) return;

    renderSectionTitle('Professional Summary');

    doc.setFont(primaryFont, 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

    const lines = doc.splitTextToSize(summary, contentWidth);
    lines.forEach((line: string) => {
      ensureSpace(4.2);
      doc.text(line, marginLeft, currentY, { baseline: 'top' });
      currentY += 3.9;
    });
    currentY += 1.6;
  }

  // =========================================================================
  // 4. BULLET POINTS WITH EXACT INDENTATION & WRAPPING
  // =========================================================================
  function renderBullets(bulletText: string) {
    if (!bulletText || !bulletText.trim()) return;

    const rawBullets = bulletText
      .split('\n')
      .map((l) => l.trim().replace(/^[•\-\*]\s*/, ''))
      .filter(Boolean);

    if (rawBullets.length === 0) return;

    const bulletIndent = 4.2;
    const textAvailableWidth = contentWidth - bulletIndent;

    rawBullets.forEach((bullet) => {
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.6);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      const lines = doc.splitTextToSize(bullet, textAvailableWidth);
      if (lines.length === 0) return;

      const itemTotalHeight = lines.length * 3.8 + 1.0;
      ensureSpace(Math.min(itemTotalHeight, 11));

      // Draw clean bullet point symbol
      doc.setFont(primaryFont, 'bold');
      doc.text('•', marginLeft + 0.8, currentY, { baseline: 'top' });

      // Draw all lines of the bullet point
      doc.setFont(primaryFont, 'normal');
      lines.forEach((line: string, idx: number) => {
        if (idx > 0) ensureSpace(3.8);
        doc.text(line, marginLeft + bulletIndent, currentY, { baseline: 'top' });
        currentY += 3.7;
      });
      currentY += 1.0;
    });
  }

  // =========================================================================
  // 5. WORK EXPERIENCE
  // =========================================================================
  function renderExperience() {
    const validExp = (data.experience || []).filter((e) => e.title?.trim() || e.company?.trim());
    if (validExp.length === 0) return;

    renderSectionTitle('Work Experience');

    validExp.forEach((exp) => {
      const company = (exp.company || 'Company').trim();
      const role = (exp.title || 'Role').trim();
      const location = (exp.location || '').trim();
      const dates = [exp.startDate?.trim(), exp.endDate?.trim()].filter(Boolean).join(' – ');

      ensureSpace(12);

      // Row 1: Company (Left, Bold) & Location (Right)
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(9.4);
      doc.setTextColor(colors.boldText[0], colors.boldText[1], colors.boldText[2]);

      const locWidth = location ? doc.getTextWidth(location) : 0;
      const compMaxWidth = contentWidth - locWidth - 4;
      const compLines = doc.splitTextToSize(company, compMaxWidth);
      doc.text(compLines[0] || company, marginLeft, currentY, { baseline: 'top' });

      if (location) {
        doc.setFont(primaryFont, isModern ? 'normal' : 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text(location, marginLeft + contentWidth, currentY, { align: 'right', baseline: 'top' });
      }
      currentY += 4.2;

      // Row 2: Role (Left, Italic/Medium) & Dates (Right)
      const dateWidth = dates ? doc.getTextWidth(dates) : 0;
      const roleMaxWidth = contentWidth - dateWidth - 4;
      const roleLines = doc.splitTextToSize(role, roleMaxWidth);

      doc.setFont(primaryFont, isProfessional ? 'italic' : isModern ? 'bold' : 'normal');
      doc.setFontSize(8.8);
      if (isModern) {
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      } else {
        doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);
      }
      doc.text(roleLines[0] || role, marginLeft, currentY, { baseline: 'top' });

      if (dates) {
        doc.setFont(primaryFont, isProfessional ? 'italic' : 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text(dates, marginLeft + contentWidth, currentY, { align: 'right', baseline: 'top' });
      }
      currentY += 4.0;

      // Bullets
      if (exp.bullets) {
        renderBullets(exp.bullets);
      }
      currentY += 1.8;
    });
  }

  // =========================================================================
  // 6. EDUCATION
  // =========================================================================
  function renderEducation() {
    const validEdu = (data.education || []).filter((e) => e.degree?.trim() || e.institution?.trim());
    if (validEdu.length === 0) return;

    renderSectionTitle('Education');

    validEdu.forEach((edu) => {
      const inst = (edu.institution || 'University').trim();
      const degree = (edu.degree || 'Degree').trim();
      const dates = [edu.startYear?.trim(), edu.endYear?.trim()].filter(Boolean).join(' – ');
      const locOrGpa = [edu.location?.trim(), edu.gpa?.trim() ? `GPA: ${edu.gpa.trim()}` : ''].filter(Boolean).join(' | ');

      ensureSpace(11);

      // Row 1: Institution (Left, Bold) & Dates (Right)
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(9.4);
      doc.setTextColor(colors.boldText[0], colors.boldText[1], colors.boldText[2]);

      const dateWidth = dates ? doc.getTextWidth(dates) : 0;
      const instLines = doc.splitTextToSize(inst, contentWidth - dateWidth - 4);
      doc.text(instLines[0] || inst, marginLeft, currentY, { baseline: 'top' });

      if (dates) {
        doc.setFont(primaryFont, 'bold');
        doc.setFontSize(8.6);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text(dates, marginLeft + contentWidth, currentY, { align: 'right', baseline: 'top' });
      }
      currentY += 4.2;

      // Row 2: Degree (Left) & Location / GPA (Right)
      doc.setFont(primaryFont, isProfessional ? 'italic' : 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      const subRightWidth = locOrGpa ? doc.getTextWidth(locOrGpa) : 0;
      const degLines = doc.splitTextToSize(degree, contentWidth - subRightWidth - 4);
      doc.text(degLines[0] || degree, marginLeft, currentY, { baseline: 'top' });

      if (locOrGpa) {
        doc.setFont(primaryFont, 'normal');
        doc.setFontSize(8.4);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text(locOrGpa, marginLeft + contentWidth, currentY, { align: 'right', baseline: 'top' });
      }
      currentY += 4.4;
    });
  }

  // =========================================================================
  // 7. SKILLS
  // =========================================================================
  function renderSkills() {
    const skills = (data.skills || []).map((s) => s.trim()).filter(Boolean);
    if (skills.length === 0) return;

    renderSectionTitle(isModern ? 'Technical & Professional Skills' : 'Technical & Core Skills');

    if (isModern) {
      // Modern interactive pill badges
      let curX = marginLeft;
      const pillHeight = 5.2;
      const pillPadX = 2.4;
      const pillGapX = 2.2;
      const pillGapY = 2.2;

      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(8.0);

      skills.forEach((skill) => {
        const textWidth = doc.getTextWidth(skill);
        const pillWidth = textWidth + pillPadX * 2;

        if (curX + pillWidth > marginLeft + contentWidth && curX > marginLeft) {
          curX = marginLeft;
          currentY += pillHeight + pillGapY;
        }

        ensureSpace(pillHeight + 2);

        // Draw pill background & border
        doc.setDrawColor(colors.pillBorder[0], colors.pillBorder[1], colors.pillBorder[2]);
        doc.setFillColor(colors.pillBg[0], colors.pillBg[1], colors.pillBg[2]);
        doc.setLineWidth(0.2);
        doc.roundedRect(curX, currentY, pillWidth, pillHeight, 1.2, 1.2, 'FD');

        // Draw pill text
        doc.setTextColor(colors.pillText[0], colors.pillText[1], colors.pillText[2]);
        doc.text(skill, curX + pillPadX, currentY + 1.2, { baseline: 'top' });

        curX += pillWidth + pillGapX;
      });

      currentY += pillHeight + 3.0;
    } else {
      // Professional / Student inline clean bullet format
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      const skillStr = skills.join('   •   ');
      const lines = doc.splitTextToSize(skillStr, contentWidth);
      lines.forEach((line: string) => {
        ensureSpace(4.2);
        doc.text(line, marginLeft, currentY, { baseline: 'top' });
        currentY += 3.9;
      });
      currentY += 2.0;
    }
  }

  // =========================================================================
  // 8. PROJECTS
  // =========================================================================
  function renderProjects() {
    const validProj = (data.projects || []).filter((p) => p.name?.trim());
    if (validProj.length === 0) return;

    renderSectionTitle('Projects & Technical Work');

    validProj.forEach((p) => {
      const name = p.name.trim();
      const linkOrRole = (p.linkOrRole || '').trim();
      const desc = (p.description || '').trim();
      const tech = (p.tech || '').trim();

      ensureSpace(12);

      // Name & Link/Role
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(9.2);
      doc.setTextColor(colors.boldText[0], colors.boldText[1], colors.boldText[2]);

      const rightWidth = linkOrRole ? doc.getTextWidth(linkOrRole) : 0;
      const nameLines = doc.splitTextToSize(name, contentWidth - rightWidth - 4);
      doc.text(nameLines[0] || name, marginLeft, currentY, { baseline: 'top' });

      if (linkOrRole) {
        doc.setFont(primaryFont, 'normal');
        doc.setFontSize(8.4);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text(linkOrRole, marginLeft + contentWidth, currentY, { align: 'right', baseline: 'top' });
      }
      currentY += 4.0;

      // Description
      if (desc) {
        doc.setFont(primaryFont, 'normal');
        doc.setFontSize(8.6);
        doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);
        const dLines = doc.splitTextToSize(desc, contentWidth);
        dLines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      }

      // Tech Stack
      if (tech) {
        doc.setFont(primaryFont, 'italic');
        doc.setFontSize(8.3);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        const tLines = doc.splitTextToSize(`Technologies: ${tech}`, contentWidth);
        tLines.forEach((line: string) => {
          ensureSpace(3.6);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.5;
        });
      }
      currentY += 2.0;
    });
  }

  // =========================================================================
  // 9. CERTIFICATIONS & LANGUAGES (SIDE-BY-SIDE OR FULL WIDTH)
  // =========================================================================
  function renderCertsAndLanguages() {
    const certs = (data.certifications || []).filter((c) => c.name?.trim());
    const langs = (data.languages || []).filter((l) => l.name?.trim());
    if (certs.length === 0 && langs.length === 0) return;

    const twoCol = certs.length > 0 && langs.length > 0;
    const colWidth = twoCol ? (contentWidth - 6) / 2 : contentWidth;
    const rightColX = marginLeft + colWidth + 6;

    if (twoCol) {
      ensureSpace(18);
      const startSectionY = currentY;

      // Left Col: Certifications
      currentY = startSectionY;
      renderSectionTitle('Certifications');

      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      certs.forEach((c) => {
        const certStr = `${c.name.trim()}${c.issuer?.trim() ? ` – ${c.issuer.trim()}` : ''}${c.year?.trim() ? ` (${c.year.trim()})` : ''}`;
        const lines = doc.splitTextToSize(`•  ${certStr}`, colWidth);
        lines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      const leftEndY = currentY;

      // Right Col: Languages
      currentY = startSectionY;
      currentY += 1.6;
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.sectionTitle[0], colors.sectionTitle[1], colors.sectionTitle[2]);
      doc.text('LANGUAGES', rightColX, currentY, { baseline: 'top' });
      currentY += 4.2;

      doc.setDrawColor(colors.sectionLine[0], colors.sectionLine[1], colors.sectionLine[2]);
      doc.setLineWidth(isModern ? 0.45 : 0.28);
      doc.line(rightColX, currentY, rightColX + colWidth, currentY);
      currentY += 2.8;

      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      langs.forEach((l) => {
        const langStr = `${l.name.trim()}${l.level?.trim() ? `: ${l.level.trim()}` : ''}`;
        const lines = doc.splitTextToSize(`•  ${langStr}`, colWidth);
        lines.forEach((line: string) => {
          doc.text(line, rightColX, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      const rightEndY = currentY;

      currentY = Math.max(leftEndY, rightEndY) + 2.0;
    } else if (certs.length > 0) {
      renderSectionTitle('Certifications');
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      certs.forEach((c) => {
        const certStr = `${c.name.trim()}${c.issuer?.trim() ? ` – ${c.issuer.trim()}` : ''}${c.year?.trim() ? ` (${c.year.trim()})` : ''}`;
        const lines = doc.splitTextToSize(`•  ${certStr}`, contentWidth);
        lines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      currentY += 1.5;
    } else {
      renderSectionTitle('Languages');
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      langs.forEach((l) => {
        const langStr = `${l.name.trim()}${l.level?.trim() ? `: ${l.level.trim()}` : ''}`;
        const lines = doc.splitTextToSize(`•  ${langStr}`, contentWidth);
        lines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      currentY += 1.5;
    }
  }

  // =========================================================================
  // 10. HONORS, AWARDS & VOLUNTEER
  // =========================================================================
  function renderAwardsAndVolunteer() {
    const awards = (data.awards || []).filter((a) => a.title?.trim());
    const vol = (data.volunteer || []).filter((v) => v.role?.trim() || v.organization?.trim());
    if (awards.length === 0 && vol.length === 0) return;

    const twoCol = awards.length > 0 && vol.length > 0;
    const colWidth = twoCol ? (contentWidth - 6) / 2 : contentWidth;
    const rightColX = marginLeft + colWidth + 6;

    if (twoCol) {
      ensureSpace(18);
      const startSectionY = currentY;

      // Left Col: Awards
      currentY = startSectionY;
      renderSectionTitle('Honors & Awards');

      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      awards.forEach((a) => {
        const str = `${a.title.trim()}${a.issuer?.trim() ? ` (${a.issuer.trim()})` : ''}${a.year?.trim() ? ` – ${a.year.trim()}` : ''}`;
        const lines = doc.splitTextToSize(`•  ${str}`, colWidth);
        lines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      const leftEndY = currentY;

      // Right Col: Volunteer
      currentY = startSectionY;
      currentY += 1.6;
      doc.setFont(primaryFont, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.sectionTitle[0], colors.sectionTitle[1], colors.sectionTitle[2]);
      doc.text('LEADERSHIP & VOLUNTEER', rightColX, currentY, { baseline: 'top' });
      currentY += 4.2;

      doc.setDrawColor(colors.sectionLine[0], colors.sectionLine[1], colors.sectionLine[2]);
      doc.setLineWidth(isModern ? 0.45 : 0.28);
      doc.line(rightColX, currentY, rightColX + colWidth, currentY);
      currentY += 2.8;

      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      vol.forEach((v) => {
        const str = `${v.role?.trim() || ''}${v.organization?.trim() ? ` – ${v.organization.trim()}` : ''}${v.details?.trim() ? `: ${v.details.trim()}` : ''}`;
        const lines = doc.splitTextToSize(`•  ${str}`, colWidth);
        lines.forEach((line: string) => {
          doc.text(line, rightColX, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      const rightEndY = currentY;

      currentY = Math.max(leftEndY, rightEndY) + 2.0;
    } else if (awards.length > 0) {
      renderSectionTitle('Honors & Awards');
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      awards.forEach((a) => {
        const str = `${a.title.trim()}${a.issuer?.trim() ? ` (${a.issuer.trim()})` : ''}${a.year?.trim() ? ` – ${a.year.trim()}` : ''}`;
        const lines = doc.splitTextToSize(`•  ${str}`, contentWidth);
        lines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      currentY += 1.5;
    } else {
      renderSectionTitle('Leadership & Volunteer');
      doc.setFont(primaryFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.primaryText[0], colors.primaryText[1], colors.primaryText[2]);

      vol.forEach((v) => {
        const str = `${v.role?.trim() || ''}${v.organization?.trim() ? ` – ${v.organization.trim()}` : ''}${v.details?.trim() ? `: ${v.details.trim()}` : ''}`;
        const lines = doc.splitTextToSize(`•  ${str}`, contentWidth);
        lines.forEach((line: string) => {
          ensureSpace(3.8);
          doc.text(line, marginLeft, currentY, { baseline: 'top' });
          currentY += 3.7;
        });
      });
      currentY += 1.5;
    }
  }

  // =========================================================================
  // 11. FOOTER (ACTIVITIES & REFERENCES)
  // =========================================================================
  function renderFooter() {
    const interests = (data.interests || '').trim();
    const references = (data.references || '').trim();
    if (!interests && !references) return;

    ensureSpace(12);

    currentY += 2.0;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.25);
    doc.line(marginLeft, currentY, marginLeft + contentWidth, currentY);
    currentY += 3.4;

    doc.setFont(primaryFont, 'normal');
    doc.setFontSize(8.3);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);

    if (interests) {
      const iLines = doc.splitTextToSize(`Activities & Interests: ${interests}`, contentWidth);
      iLines.forEach((line: string) => {
        ensureSpace(3.5);
        doc.text(line, marginLeft, currentY, { baseline: 'top' });
        currentY += 3.4;
      });
    }

    if (references) {
      const rLines = doc.splitTextToSize(`References: ${references}`, contentWidth);
      rLines.forEach((line: string) => {
        ensureSpace(3.5);
        doc.text(line, marginLeft, currentY, { baseline: 'top' });
        currentY += 3.4;
      });
    }
  }

  // Master Layout Ordering Based on Template
  renderHeader();
  renderSummary();

  if (isStudent) {
    renderEducation();
    renderSkills();
    renderProjects();
    renderExperience();
    renderCertsAndLanguages();
    renderAwardsAndVolunteer();
    renderFooter();
  } else {
    renderExperience();
    renderSkills();
    renderEducation();
    renderProjects();
    renderCertsAndLanguages();
    renderAwardsAndVolunteer();
    renderFooter();
  }

  return doc;
}
