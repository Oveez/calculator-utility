export interface ToolIndexItem {
  title: string;
  category: string;
  url: string;
  desc: string;
}

export const allToolsIndex: ToolIndexItem[] = [
  // 1. Finance (8)
  { title: 'Mortgage Calculator', category: 'Finance', url: '/calculators/mortgage-calculator/', desc: 'Calculate monthly loan payments, amortizations, and interest costs.' },
  { title: 'Compound Interest Calculator', category: 'Finance', url: '/calculators/compound-interest-calculator/', desc: 'Forecast future investment growth with monthly contributions and compounding.' },
  { title: 'Simple Interest Calculator', category: 'Finance', url: '/calculators/simple-interest-calculator/', desc: 'Calculate interest on short-term promissory notes and loans.' },
  { title: 'Tip & Bill Split Calculator', category: 'Finance', url: '/calculators/tip-calculator/', desc: 'Calculate tip percentages, total dining bills, and per-person splits.' },
  { title: 'Discount & Sales Tax Calculator', category: 'Finance', url: '/calculators/discount-calculator/', desc: 'Compute clearance discounts, net savings, and sales tax totals.' },
  { title: 'Salary & Wage Calculator', category: 'Finance', url: '/calculators/salary-calculator/', desc: 'Convert hourly wages into annual, monthly, and paycheck totals.' },
  { title: 'Auto Loan Calculator', category: 'Finance', url: '/calculators/auto-loan-calculator/', desc: 'Estimate vehicle loan payments with down payment and trade-in value.' },
  { title: 'Investment Growth Calculator', category: 'Finance', url: '/calculators/investment-calculator/', desc: 'Project long-term stock portfolio wealth and compound returns.' },

  // 2. Education (4)
  { title: 'GPA Calculator', category: 'Education', url: '/calculators/gpa-calculator/', desc: 'Weighted grade point average calculator from course credits.' },
  { title: 'CGPA Calculator', category: 'Education', url: '/calculators/cgpa-calculator/', desc: 'Cumulative grade point average across college semesters.' },
  { title: 'Grade Calculator', category: 'Education', url: '/calculators/grade-calculator/', desc: 'Convert raw test marks into percentages and letter grades.' },
  { title: 'Percentage Calculator', category: 'Math', url: '/calculators/percentage-calculator/', desc: 'Work out what percentage one number is of a whole.' },

  // 3. Health (3)
  { title: 'BMI Calculator', category: 'Health', url: '/calculators/bmi-calculator/', desc: 'Body Mass Index calculator with WHO & CDC categories.' },
  { title: 'Daily Calorie & TDEE Calculator', category: 'Health', url: '/calculators/calorie-calculator/', desc: 'Mifflin-St Jeor daily energy expenditure and maintenance calories.' },
  { title: 'Daily Water Intake Calculator', category: 'Health', url: '/calculators/water-intake-calculator/', desc: 'Calculate optimal fluid targets by body weight and activity.' },

  // 4. Math & Numbers (5)
  { title: 'Percentage Difference', category: 'Math', url: '/calculators/percentage-difference/', desc: 'Compare two values and see their relative percentage gap.' },
  { title: 'Ratio Calculator', category: 'Math', url: '/calculators/ratio-calculator/', desc: 'Simplify and scale ratios between numbers.' },
  { title: 'Fraction Calculator', category: 'Math', url: '/calculators/fraction-calculator/', desc: 'Add, subtract, multiply, and simplify fractional numbers.' },
  { title: 'Average Calculator', category: 'Math', url: '/calculators/average-calculator/', desc: 'Compute mean, median, mode, and total sum for data sets.' },
  { title: 'Storage Unit Converter', category: 'Converters', url: '/calculators/storage-unit-converter/', desc: 'Convert bytes, KB, MB, GB, TB, and petabytes.' },

  // 5. Date, Time & Text (6)
  { title: 'Age Calculator', category: 'Time', url: '/calculators/age-calculator/', desc: 'Exact chronological age in years, months, days, and hours.' },
  { title: 'Date Difference Calculator', category: 'Time', url: '/calculators/date-difference-calculator/', desc: 'Calculate exact elapsed calendar days between two dates.' },
  { title: 'Countdown Calculator', category: 'Time', url: '/calculators/countdown-calculator/', desc: 'Live countdown timer to future milestones and events.' },
  { title: 'Working Days Calculator', category: 'Time', url: '/calculators/working-days-calculator/', desc: 'Count business workdays excluding weekends and holidays.' },
  { title: 'Word Counter', category: 'Text', url: '/calculators/word-counter/', desc: 'Accurate word count, reading time, and speaking time.' },
  { title: 'Character Counter', category: 'Text', url: '/calculators/character-counter/', desc: 'Character count with and without whitespace.' },

  // 6. Converters (4)
  { title: 'Case Converter', category: 'Text', url: '/calculators/case-converter/', desc: 'Convert text to UPPERCASE, lowercase, Title Case, and camelCase.' },
  { title: 'Length Converter', category: 'Converters', url: '/calculators/length-converter/', desc: 'Convert meters, feet, inches, kilometers, and miles.' },
  { title: 'Weight Converter', category: 'Converters', url: '/calculators/weight-converter/', desc: 'Convert kilograms, pounds, ounces, grams, and stone.' },
  { title: 'Temperature Converter', category: 'Converters', url: '/calculators/temperature-converter/', desc: 'Convert Celsius, Fahrenheit, and Kelvin instantly.' },

  // 7. International Tax Suite (28)
  { title: 'Currency Converter', category: 'Tax & Finance', url: '/currency-converter/', desc: 'Live multi-currency exchange rates with zero commission math.' },
  { title: 'Global VAT & Sales Tax Calculator', category: 'Tax & Finance', url: '/tax-calculators/vat-calculator/', desc: 'Calculate inclusive and exclusive VAT/GST for any tax rate.' },
  { title: 'Salary to Hourly Calculator', category: 'Tax & Finance', url: '/tax-calculators/salary-to-hourly/', desc: 'Convert annual compensation to exact hourly wage rates.' },
  { title: 'Hourly to Salary Calculator', category: 'Tax & Finance', url: '/tax-calculators/hourly-to-salary/', desc: 'Convert hourly rate into full-time annual salary.' },
  { title: 'United States Tax Calculator', category: 'Tax & Finance', url: '/us-income-tax-calculator/', desc: 'US IRS federal tax brackets, FICA, standard deduction.' },
  { title: 'United Kingdom Salary Calculator', category: 'Tax & Finance', url: '/uk-income-tax-calculator/', desc: 'HMRC PAYE income tax, National Insurance, and take-home pay.' },
  { title: 'Canada Income Tax Calculator', category: 'Tax & Finance', url: '/canada-income-tax-calculator/', desc: 'CRA federal and provincial tax brackets, CPP and EI.' },
  { title: 'Australia Income Tax Calculator', category: 'Tax & Finance', url: '/australia-income-tax-calculator/', desc: 'ATO resident tax brackets and Medicare levy.' },
  { title: 'Germany Salary Calculator', category: 'Tax & Finance', url: '/germany-income-tax-calculator/', desc: 'German BMF income tax, solidarity surcharge, and social insurance.' },
  { title: 'France Income Tax Calculator', category: 'Tax & Finance', url: '/france-income-tax-calculator/', desc: 'French DGFiP quotient familial, CSG/CRDS, and net salary.' },
  { title: 'Ireland Salary Calculator', category: 'Tax & Finance', url: '/ireland-income-tax-calculator/', desc: 'Irish Revenue PAYE standard rate cutoff, USC, and PRSI.' },
  { title: 'Netherlands Tax Calculator', category: 'Tax & Finance', url: '/netherlands-income-tax-calculator/', desc: 'Dutch Box 1 income tax brackets and labor tax credits.' },
  { title: 'Spain Salary Calculator', category: 'Tax & Finance', url: '/spain-income-tax-calculator/', desc: 'Spanish AEAT IRPF progressive brackets and Social Security.' },
  { title: 'Italy Income Tax Calculator', category: 'Tax & Finance', url: '/italy-income-tax-calculator/', desc: 'Italian IRPEF national progressive rates and INPS.' },
  { title: 'Switzerland Salary Calculator', category: 'Tax & Finance', url: '/switzerland-income-tax-calculator/', desc: 'Swiss direct federal tax and cantonal estimates.' },
  { title: 'Belgium Salary Calculator', category: 'Tax & Finance', url: '/belgium-income-tax-calculator/', desc: 'Belgian progressive personal income tax and ONSS.' },
  { title: 'Austria Income Tax Calculator', category: 'Tax & Finance', url: '/austria-income-tax-calculator/', desc: 'Austrian progressive Einkommensteuer and social insurance.' },
  { title: 'Sweden Salary Calculator', category: 'Tax & Finance', url: '/sweden-income-tax-calculator/', desc: 'Swedish municipal tax, state tax threshold, and jobbskatteavdrag.' },
  { title: 'Norway Salary Calculator', category: 'Tax & Finance', url: '/norway-income-tax-calculator/', desc: 'Norwegian ordinary income tax, trinnskatt, and trygdeavgift.' },
  { title: 'Denmark Salary Calculator', category: 'Tax & Finance', url: '/denmark-income-tax-calculator/', desc: 'Danish AM-bidrag labor market tax and municipal taxes.' },
  { title: 'Finland Income Tax Calculator', category: 'Tax & Finance', url: '/finland-income-tax-calculator/', desc: 'Finnish state progressive tax and municipal flat tax.' },
  { title: 'Poland Salary Calculator', category: 'Tax & Finance', url: '/poland-income-tax-calculator/', desc: 'Polish Skala podatkowa tax thresholds and ZUS deductions.' },
  { title: 'Singapore Income Tax Calculator', category: 'Tax & Finance', url: '/singapore-income-tax-calculator/', desc: 'Singapore IRAS progressive resident tax and CPF.' },
  { title: 'Japan Income Tax Calculator', category: 'Tax & Finance', url: '/japan-income-tax-calculator/', desc: 'Japanese NTA national income tax, local inhabitant tax.' },
  { title: 'South Korea Tax Calculator', category: 'Tax & Finance', url: '/south-korea-income-tax-calculator/', desc: 'Korean national tax, local income tax, and Four Insurances.' },
  { title: 'New Zealand Salary Calculator', category: 'Tax & Finance', url: '/new-zealand-income-tax-calculator/', desc: 'NZ IRD PAYE tax brackets and ACC earners levy.' },
  { title: 'Mexico Income Tax Calculator', category: 'Tax & Finance', url: '/mexico-income-tax-calculator/', desc: 'Mexican SAT ISR progressive table and IMSS worker deductions.' },
  { title: 'Portugal Salary Calculator', category: 'Tax & Finance', url: '/portugal-income-tax-calculator/', desc: 'Portuguese IRS progressive escalation rates and Social Security.' },

  // 8. Academic & Student Tools (7)
  { title: 'Attendance Calculator', category: 'Academic', url: '/academic-tools/attendance-calculator/', desc: 'Check if attendance meets 75% or 80% college requirements.' },
  { title: 'Safe Bunk Calculator', category: 'Academic', url: '/academic-tools/bunk-calculator/', desc: 'Calculate how many classes you can skip without failing attendance.' },
  { title: 'Final Grade Calculator', category: 'Academic', url: '/academic-tools/final-grade-calculator/', desc: 'Find the exact score needed on your final exam to secure a course grade.' },
  { title: 'Grade Needed Calculator', category: 'Academic', url: '/academic-tools/grade-needed-calculator/', desc: 'Determine minimum scores required on remaining assignments.' },
  { title: 'Semester GPA Calculator', category: 'Academic', url: '/academic-tools/semester-gpa-calculator/', desc: 'Compute dynamic semester grade points across courses.' },
  { title: 'Credit Hour Calculator', category: 'Academic', url: '/academic-tools/credit-hour-calculator/', desc: 'Calculate weekly study hours per enrolled credit hour.' },
  { title: 'Weekly Study Hours Calculator', category: 'Academic', url: '/academic-tools/study-hours-calculator/', desc: 'Build an optimized semester study allocation schedule.' },

  // 9. Research & Statistics (16)
  { title: 'Sample Size Calculator', category: 'Research', url: '/research-tools/sample-size-calculator/', desc: 'Determine statistically valid sample sizes with confidence levels.' },
  { title: 'Margin of Error Calculator', category: 'Research', url: '/research-tools/margin-of-error-calculator/', desc: 'Compute survey precision percentage from sample data.' },
  { title: 'Confidence Interval Calculator', category: 'Research', url: '/research-tools/confidence-interval-calculator/', desc: 'Find lower and upper estimation bounds for sample means.' },
  { title: 'Z-Score Calculator', category: 'Research', url: '/research-tools/z-score-calculator/', desc: 'Convert raw test observations to standard normal Z scores.' },
  { title: 'T-Score Calculator', category: 'Research', url: '/research-tools/t-score-calculator/', desc: 'Student T-distribution probability and critical value calculator.' },
  { title: 'P-Value Calculator', category: 'Research', url: '/research-tools/p-value-calculator/', desc: 'Compute hypothesis testing significance from test statistics.' },
  { title: 'Standard Error Calculator', category: 'Research', url: '/research-tools/standard-error-calculator/', desc: 'Estimate sampling distribution variability from sample SD.' },
  { title: 'A/B Test Sample Size Calculator', category: 'Research', url: '/research-tools/ab-test-sample-size-calculator/', desc: 'Calculate sample size per variant for statistical power in CRO.' },
  { title: 'DOI to Citation Generator', category: 'Research', url: '/research-tools/doi-to-citation/', desc: 'Format APA 7, MLA 9, BibTeX, and Chicago citations from DOIs.' },
  { title: 'ISBN Citation Generator', category: 'Research', url: '/research-tools/isbn-citation-generator/', desc: 'Generate complete book bibliography from 10 or 13-digit ISBNs.' },
  { title: 'Random Sample Generator', category: 'Research', url: '/research-tools/random-sample-generator/', desc: 'True random sampling without replacement from integer ranges or lists.' },
  { title: 'Participant ID Generator', category: 'Research', url: '/research-tools/participant-id-generator/', desc: 'Generate randomized, IRB-compliant research subject identifiers.' },
  { title: 'Likert Scale Survey Matrix Designer', category: 'Research', url: '/research-tools/likert-scale-generator/', desc: 'Generate 5-point and 7-point psychometric survey rating matrices.' },
  { title: 'Correlation & Covariance Calculator', category: 'Research', url: '/research-tools/correlation-calculator/', desc: 'Compute Pearson r, coefficient of determination R², and covariance.' },
  { title: 'Standard Deviation Calculator', category: 'Research', url: '/research-tools/standard-deviation-calculator/', desc: 'Calculate sample and population standard deviation, variance, and mean.' },
  { title: 'Coefficient of Variation Calculator', category: 'Research', url: '/research-tools/coefficient-of-variation-calculator/', desc: 'Calculate Relative Standard Deviation (CV / RSD %) across data sets.' },

  // 10. Business & Freelance (6)
  { title: 'Freelance Hourly Rate Calculator', category: 'Business', url: '/business-tools/freelance-rate-calculator/', desc: 'Calculate sustainable freelance billing rates from expenses and target profit.' },
  { title: 'YouTube RPM & Earnings Calculator', category: 'Business', url: '/business-tools/youtube-rpm-calculator/', desc: 'Estimate YouTube AdSense revenue from video views and niche RPM.' },
  { title: 'Etsy Profit & Fee Calculator', category: 'Business', url: '/business-tools/etsy-profit-calculator/', desc: 'Calculate net profit after Etsy listing, transaction, and payment processing fees.' },
  { title: 'Shopify Profit & Margin Calculator', category: 'Business', url: '/business-tools/shopify-profit-calculator/', desc: 'Analyze ecommerce net profit margins including gateway fees and shipping.' },
  { title: 'Sales Commission Calculator', category: 'Business', url: '/business-tools/commission-calculator/', desc: 'Calculate tiered sales commissions, bonuses, and gross earnings.' },
  { title: 'Real Estate Commission Calculator', category: 'Business', url: '/business-tools/real-estate-commission-calculator/', desc: 'Calculate realtor commission splits between listing and buyer agents.' },

  // 11. Shipping & Freight Logistics (5)
  { title: 'CBM (Cubic Meters) Calculator', category: 'Shipping', url: '/shipping-calculators/cbm-calculator/', desc: 'Calculate cubic meter volume and package count for freight shipments.' },
  { title: 'Volumetric Weight Calculator', category: 'Shipping', url: '/shipping-calculators/volumetric-weight-calculator/', desc: 'Calculate dimensional weight for air, courier, and ocean freight.' },
  { title: 'Dimensional Weight Calculator', category: 'Shipping', url: '/shipping-calculators/dimensional-weight-calculator/', desc: 'Compute billable dimensional weight using IATA and domestic divisors.' },
  { title: 'Chargeable Weight Calculator', category: 'Shipping', url: '/shipping-calculators/chargeable-weight-calculator/', desc: 'Determine billable freight weight by comparing actual vs volumetric weight.' },
  { title: 'Container Capacity Calculator', category: 'Shipping', url: '/shipping-calculators/container-capacity-calculator/', desc: 'Estimate how many cartons fit in 20ft, 40ft, and 40ft High Cube containers.' },

  // 12. Product & Craft Pricing (3)
  { title: 'Custom Sticker Pricing Calculator', category: 'Pricing', url: '/pricing-calculators/sticker-pricing-calculator/', desc: 'Calculate sticker sheet material costs, machine time, and retail price.' },
  { title: 'Handmade Product Pricing Calculator', category: 'Pricing', url: '/pricing-calculators/handmade-product-pricing-calculator/', desc: 'Calculate wholesale and retail markups for craft and handmade goods.' },
  { title: 'Break-Even Unit Calculator', category: 'Pricing', url: '/pricing-calculators/break-even-calculator/', desc: 'Find unit sales volume required to cover fixed overhead and variable costs.' },

  // 13. Career & Resume Tools (8)
  { title: 'CV & Resume Maker (ATS-Standard)', category: 'Career', url: '/career-tools/cv-maker/', desc: 'Professional Harvard & Wall Street standard resume builder with PDF export.' },
  { title: 'Student CV Maker', category: 'Career', url: '/career-tools/student-cv-maker/', desc: 'Ivy League early career resume template tailored for university students.' },
  { title: 'Fresher Resume Maker', category: 'Career', url: '/career-tools/fresher-resume-maker/', desc: 'Modern resume template optimized for entry-level candidates and interns.' },
  { title: 'ATS-Friendly Resume Guide', category: 'Career', url: '/career-tools/ats-friendly-resume-guide/', desc: 'Comprehensive guide to beating Applicant Tracking Systems.' },
  { title: 'Resume Action Verb & Keyword Checker', category: 'Career', url: '/career-tools/resume-keyword-checker/', desc: 'Scan resume text for strong action verbs, quantifiable metrics, and impact.' },
  { title: 'Job Description Keyword Extractor', category: 'Career', url: '/career-tools/job-description-keyword-extractor/', desc: 'Extract key technical skills and requirements from job postings.' },
  { title: 'Resume-to-Job ATS Matcher', category: 'Career', url: '/career-tools/resume-job-matcher/', desc: 'Calculate ATS overlap percentage and identify missing keywords.' },
  { title: 'Resume Length & Density Checker', category: 'Career', url: '/career-tools/resume-length-checker/', desc: 'Audit resume word count, bullet density, and 1-page/2-page sweet spot.' },

  // 14. Developer Tools (17)
  { title: 'JSON Formatter & Beautifier', category: 'Developer', url: '/developer-tools/json-formatter/', desc: 'Format and prettify raw JSON with customizable indentation and tree viewing.' },
  { title: 'JSON Validator & Linter', category: 'Developer', url: '/developer-tools/json-validator/', desc: 'Validate JSON syntax and pinpoint exact line and column errors.' },
  { title: 'JSON Minifier & Compressor', category: 'Developer', url: '/developer-tools/json-minifier/', desc: 'Strip all whitespace and line breaks from JSON payloads for production.' },
  { title: 'JSON Diff Comparator', category: 'Developer', url: '/developer-tools/json-diff/', desc: 'Compare two JSON objects side-by-side and highlight additions and deletions.' },
  { title: 'JSON to CSV Converter', category: 'Developer', url: '/developer-tools/json-to-csv/', desc: 'Convert structured JSON arrays into clean CSV spreadsheets.' },
  { title: 'JSON to YAML Converter', category: 'Developer', url: '/developer-tools/json-to-yaml/', desc: 'Transform JSON data into clean, indented YAML configuration syntax.' },
  { title: 'YAML to JSON Converter', category: 'Developer', url: '/developer-tools/yaml-to-json/', desc: 'Convert YAML configuration documents into valid JSON syntax.' },
  { title: 'XML to JSON Converter', category: 'Developer', url: '/developer-tools/xml-to-json/', desc: 'Convert XML markup documents into structured JSON objects.' },
  { title: 'Base64 Encoder & Decoder', category: 'Developer', url: '/developer-tools/base64-encoder-decoder/', desc: 'Encode and decode plain text to and from Base64 string representations.' },
  { title: 'URL Encoder & Decoder', category: 'Developer', url: '/developer-tools/url-encoder-decoder/', desc: 'Encode special characters into percent-encoded URI strings and decode them back.' },
  { title: 'Regex Tester & Matcher', category: 'Developer', url: '/developer-tools/regex-tester/', desc: 'Test regular expressions in real-time with match highlighting and capture groups.' },
  { title: 'Regex String Escape Tool', category: 'Developer', url: '/developer-tools/regex-escape/', desc: 'Escape special regular expression characters for literal string matching.' },
  { title: 'JWT (JSON Web Token) Decoder', category: 'Developer', url: '/developer-tools/jwt-decoder/', desc: 'Decode and inspect JWT headers and payload claims with live expiration status.' },
  { title: 'Hash Generator (MD5, SHA-1, SHA-256, SHA-512)', category: 'Developer', url: '/developer-tools/hash-generator/', desc: 'Compute one-way cryptographic hash digests from text.' },
  { title: 'UUID & GUID Generator', category: 'Developer', url: '/developer-tools/uuid-generator/', desc: 'Generate single or bulk cryptographically secure UUID Version-4 identifiers.' },
  { title: 'Unix Timestamp Converter', category: 'Developer', url: '/developer-tools/timestamp-converter/', desc: 'Convert Unix epoch timestamps to UTC and local human-readable dates.' },
  { title: 'Cron Expression Generator & Explainer', category: 'Developer', url: '/developer-tools/cron-expression-generator/', desc: 'Build 5-field cron schedule expressions with plain-English human descriptions.' },

  // 15. Data & CSV Tools (6)
  { title: 'CSV to JSON Converter', category: 'Data', url: '/data-tools/csv-to-json/', desc: 'Parse CSV files into structured JSON array of objects.' },
  { title: 'CSV Column Extractor', category: 'Data', url: '/data-tools/csv-column-extractor/', desc: 'Select and export specific columns from large CSV datasets.' },
  { title: 'CSV Deduplicator', category: 'Data', url: '/data-tools/csv-deduplicator/', desc: 'Remove duplicate rows from CSV files based on specific key columns.' },
  { title: 'CSV Sorter', category: 'Data', url: '/data-tools/csv-sorter/', desc: 'Sort CSV rows alphabetically, numerically, or chronologically.' },
  { title: 'CSV Filter', category: 'Data', url: '/data-tools/csv-filter/', desc: 'Filter CSV data rows matching specific column conditions or thresholds.' },
  { title: 'CSV to Markdown Table Converter', category: 'Data', url: '/data-tools/csv-to-markdown/', desc: 'Convert CSV spreadsheet data into GitHub-flavored Markdown tables.' },

  // 16. Text Utilities (11)
  { title: 'Text Diff & Comparison Checker', category: 'Text', url: '/text-tools/text-diff-checker/', desc: 'Compare two text blocks side-by-side with line additions and deletions.' },
  { title: 'Duplicate Line Remover', category: 'Text', url: '/text-tools/duplicate-line-remover/', desc: 'Clean duplicate lines from lists while preserving original order.' },
  { title: 'Empty Line Remover', category: 'Text', url: '/text-tools/empty-line-remover/', desc: 'Strip blank and whitespace-only lines from code and text.' },
  { title: 'Line Sorter & Reverser', category: 'Text', url: '/text-tools/line-sorter/', desc: 'Sort lines alphabetically A-Z, Z-A, by length, or reverse order.' },
  { title: 'Whitespace & Tab Remover', category: 'Text', url: '/text-tools/whitespace-remover/', desc: 'Strip leading/trailing spaces, collapse multiple spaces, or remove tabs.' },
  { title: 'Find & Replace in Text', category: 'Text', url: '/text-tools/find-and-replace/', desc: 'Batch find and replace substrings or regex patterns across text.' },
  { title: 'Text Cleaner & Sanitizer', category: 'Text', url: '/text-tools/text-cleaner/', desc: 'Sanitize smart quotes, fix line endings, and remove non-ASCII characters.' },
  { title: 'HTML to Plain Text Converter', category: 'Text', url: '/text-tools/html-to-text/', desc: 'Strip HTML tags, styles, and scripts while preserving text structure.' },
  { title: 'Markdown to HTML Converter', category: 'Text', url: '/text-tools/markdown-to-html/', desc: 'Convert Markdown formatted text into clean semantic HTML.' },
  { title: 'Lorem Ipsum Placeholder Generator', category: 'Text', url: '/text-tools/lorem-ipsum-generator/', desc: 'Generate dummy filler paragraphs, sentences, and word counts.' },
  { title: 'URL Slug Generator', category: 'Text', url: '/text-tools/slug-generator/', desc: 'Convert titles and phrases into clean, SEO-friendly URL slugs.' },

  // 17. URL & Web Tools (7)
  { title: 'URL Parameter Extractor', category: 'URL', url: '/url-tools/url-parameter-extractor/', desc: 'Deconstruct web URLs into protocol, domain, path, hash, and query params.' },
  { title: 'Query String Parser', category: 'URL', url: '/url-tools/query-string-parser/', desc: 'Parse query parameters into key-value tables and structured JSON.' },
  { title: 'Query String Builder', category: 'URL', url: '/url-tools/query-string-builder/', desc: 'Build and encode custom URL query strings from key-value pairs.' },
  { title: 'UTM Campaign URL Builder', category: 'URL', url: '/url-tools/utm-builder/', desc: 'Create trackable marketing URLs with source, medium, and campaign tags.' },
  { title: 'UTM Parameter Parser', category: 'URL', url: '/url-tools/utm-parser/', desc: 'Extract and analyze UTM tracking parameters from marketing links.' },
  { title: 'URL Tracking Parameter Cleaner', category: 'URL', url: '/url-tools/url-cleaner/', desc: 'Strip intrusive tracking IDs (fbclid, gclid, utm_*) from URLs.' },
  { title: 'HTML Entity Encoder & Decoder', category: 'URL', url: '/url-tools/html-entity-encoder-decoder/', desc: 'Convert characters to named and numeric HTML entities.' },

  // 18. Image & Privacy Tools (10)
  { title: 'EXIF Metadata Viewer', category: 'Image', url: '/image-tools/exif-viewer/', desc: 'Read embedded camera, GPS coordinates, shutter, and ISO metadata.' },
  { title: 'EXIF Metadata Remover (Privacy Tool)', category: 'Image', url: '/image-tools/exif-remover/', desc: 'Strip GPS location coordinates and camera signatures from photos.' },
  { title: 'Image Metadata & File Viewer', category: 'Image', url: '/image-tools/image-metadata-viewer/', desc: 'Inspect dimensions, MIME type, file size, and color space.' },
  { title: 'Image Dimension Checker', category: 'Image', url: '/image-tools/image-dimension-checker/', desc: 'Check pixel width, height, and social media post compatibility.' },
  { title: 'Image DPI & Print Size Checker', category: 'Image', url: '/image-tools/image-dpi-checker/', desc: 'Calculate physical print dimensions at 72, 150, and 300 DPI.' },
  { title: 'Image Aspect Ratio Checker & Cropper', category: 'Image', url: '/image-tools/image-aspect-ratio-checker/', desc: 'Determine aspect ratios (16:9, 4:3, 1:1, 9:16) with crop preview.' },
  { title: 'Image Color Picker & Eyedropper', category: 'Image', url: '/image-tools/image-color-picker/', desc: 'Sample exact HEX and RGB color values from uploaded images.' },
  { title: 'Dominant Color Palette Extractor', category: 'Image', url: '/image-tools/dominant-color-extractor/', desc: 'Extract harmonious 5-color palettes using K-Means clustering.' },
  { title: 'In-Browser Image Compressor', category: 'Image', url: '/image-tools/image-compressor/', desc: 'Compress JPEG, PNG, and WebP images locally with quality controls.' },
  { title: 'Image Format Converter (PNG, JPG, WebP)', category: 'Image', url: '/image-tools/image-converter/', desc: 'Convert between PNG, JPEG, and WebP image formats.' },

  // 19. PDF Tools (10)
  { title: 'PDF Page Counter', category: 'PDF', url: '/pdf-tools/pdf-page-counter/', desc: 'Fast binary inspection of total page count in PDF documents.' },
  { title: 'PDF Metadata Viewer', category: 'PDF', url: '/pdf-tools/pdf-metadata-viewer/', desc: 'Inspect author, title, creation date, and software producer metadata.' },
  { title: 'PDF Metadata Remover', category: 'PDF', url: '/pdf-tools/pdf-metadata-remover/', desc: 'Wipe sensitive document creator names and PDF software tags.' },
  { title: 'PDF Page Extractor', category: 'PDF', url: '/pdf-tools/pdf-page-extractor/', desc: 'Extract specific page numbers or custom page ranges into a new PDF.' },
  { title: 'PDF Page Reorderer', category: 'PDF', url: '/pdf-tools/pdf-page-reorderer/', desc: 'Rearrange and resequence pages in PDF documents.' },
  { title: 'PDF Splitter (Custom Ranges & Pages)', category: 'PDF', url: '/pdf-tools/pdf-splitter/', desc: 'Split multi-page PDFs into single pages or custom range parts.' },
  { title: 'PDF Merger (Combine PDFs)', category: 'PDF', url: '/pdf-tools/pdf-merger/', desc: 'Combine multiple PDF files into one unified document.' },
  { title: 'Images to PDF Converter', category: 'PDF', url: '/pdf-tools/images-to-pdf/', desc: 'Compile JPG and PNG photos into a standardized paginated PDF.' },
  { title: 'PDF to Images Rasterizer', category: 'PDF', url: '/pdf-tools/pdf-to-images/', desc: 'Rasterize PDF pages into high-resolution PNG or JPG images.' },
  { title: 'PDF Page Rotator', category: 'PDF', url: '/pdf-tools/pdf-rotate/', desc: 'Rotate PDF pages 90, 180, or 270 degrees permanently.' },

  // 20. Color & Accessibility (8)
  { title: 'Color Contrast Checker (WCAG 2.1)', category: 'Color', url: '/color-tools/color-contrast-checker/', desc: 'Test text and background contrast ratios against AA and AAA standards.' },
  { title: 'HEX to RGB / RGBA Converter', category: 'Color', url: '/color-tools/hex-to-rgb/', desc: 'Convert hex color codes to RGB and RGBA values with alpha opacity.' },
  { title: 'RGB to HEX Converter', category: 'Color', url: '/color-tools/rgb-to-hex/', desc: 'Convert RGB channel numbers (0-255) into standard 6-digit hex codes.' },
  { title: 'RGB to HSL Converter', category: 'Color', url: '/color-tools/rgb-to-hsl/', desc: 'Convert RGB colors to Hue, Saturation, and Lightness percentages.' },
  { title: 'CMYK to RGB Converter', category: 'Color', url: '/color-tools/cmyk-to-rgb/', desc: 'Convert print ink CMYK percentages to digital screen RGB values.' },
  { title: 'CSS Gradient Generator', category: 'Color', url: '/color-tools/css-gradient-generator/', desc: 'Create linear and radial CSS gradients with multi-stop color controls.' },
  { title: 'CSS Box Shadow Generator', category: 'Color', url: '/color-tools/css-box-shadow-generator/', desc: 'Generate multi-layer elevation and inset CSS box shadows.' },
  { title: 'CSS Border Radius Generator (Organic Blobs)', category: 'Color', url: '/color-tools/css-border-radius-generator/', desc: 'Create custom 8-point asymmetric border-radius organic shapes.' },

  // 21. Education & Classroom (6)
  { title: 'Random Student Picker Wheel', category: 'Education', url: '/education-tools/random-student-picker/', desc: 'Fair cold-calling student selector wheel with drawn-name removal.' },
  { title: 'Random Group Generator', category: 'Education', url: '/education-tools/random-group-generator/', desc: 'Divide student rosters into balanced groups by count or group size.' },
  { title: 'Random Team Generator', category: 'Education', url: '/education-tools/random-team-generator/', desc: 'Allocate sports rosters and classroom projects into balanced teams.' },
  { title: 'Classroom Seating Chart Generator', category: 'Education', url: '/education-tools/seating-chart-generator/', desc: 'Design interactive classroom seating charts in rows and columns.' },
  { title: 'Exam Seating Layout Generator', category: 'Education', url: '/education-tools/exam-seating-generator/', desc: 'Generate alternating exam hall seating plans to prevent cheating.' },
  { title: 'Study Schedule & Revision Planner', category: 'Education', url: '/education-tools/study-schedule-generator/', desc: 'Generate spaced repetition study timetables for exam preparation.' },

  // 22. Generators (8)
  { title: 'CSPRNG Random Number Generator', category: 'Generators', url: '/generators/random-number-generator/', desc: 'Generate single or bulk cryptographically secure random numbers.' },
  { title: 'Random Name & Winner Picker', category: 'Generators', url: '/generators/random-name-picker/', desc: 'Pick giveaway, contest, or raffle winners fairly with sound effects.' },
  { title: 'Random Choice Decision Maker', category: 'Generators', url: '/generators/random-choice-generator/', desc: 'Make quick everyday decisions with customizable choice presets.' },
  { title: 'Strong Password Generator', category: 'Generators', url: '/generators/password-generator/', desc: 'Generate uncrackable, high-entropy passwords with custom symbols.' },
  { title: 'Diceware Passphrase Generator', category: 'Generators', url: '/generators/passphrase-generator/', desc: 'Generate memorable, ultra-secure multi-word passphrases.' },
  { title: 'QR Code Generator (URL, WiFi, Text, Email)', category: 'Generators', url: '/generators/qr-code-generator/', desc: 'Generate scannable 2D QR barcodes with custom colors and PNG download.' },
  { title: 'Invoice Number Generator', category: 'Generators', url: '/generators/invoice-number-generator/', desc: 'Generate sequential and date-based invoice billing serial codes.' },
  { title: 'SKU (Stock Keeping Unit) Generator', category: 'Generators', url: '/generators/sku-generator/', desc: 'Generate standardized inventory product SKU codes for retail & Shopify.' },
];
