import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

export type ReportPdfData = {
  studentName: string;
  studentEmail: string;
  teacherName: string;
  teacherEmail: string;
  trainingDate: string;
  classNumber: string;
  trainingName: string;
  projectName: string;
  objectives: string[];
  selectedConcepts: string[];
  selectedSkills: string[];
  lessonOverview: string;
  feedback: string;
  highlight: string;
  challenge: string;
  homework: string;
  images: (string | null)[];
  imageCaptions: string[];
  reportId: string;
};

const COMPANY_NAME = 'EIM TECHNOLOGY';
const COMPANY_LOGO = 'https://raw.githubusercontent.com/Terback/Images/main/logo/icon_darkblue.png';

const colors = {
  brand: '#1464A0',
  text: '#0f172a',
  muted: '#64748b',
  faint: '#94a3b8',
  border: '#e2e8f0',
  panel: '#f8fafc',
  bluePanel: '#eff6ff',
  greenPanel: '#ecfdf5',
  green: '#047857',
  redPanel: '#fef2f2',
  red: '#b91c1c',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingHorizontal: 45,
    paddingBottom: 56,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 16,
    marginBottom: 22,
    borderBottomWidth: 2,
    borderBottomColor: colors.brand,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    objectFit: 'contain',
    marginRight: 12,
  },
  companyName: {
    color: colors.brand,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.1,
  },
  reportType: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  headerMeta: {
    alignItems: 'flex-end',
  },
  headerDate: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 3,
  },
  headerClass: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.brand,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  reportId: {
    color: colors.faint,
    fontSize: 7,
    fontWeight: 700,
  },
  sectionTitle: {
    color: colors.brand,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 9,
  },
  centeredTitle: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  infoBlock: {
    width: '50%',
  },
  infoLabel: {
    color: colors.brand,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 3,
  },
  infoSub: {
    color: colors.muted,
    fontSize: 10,
  },
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
  trainingTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 13,
  },
  microLabel: {
    color: colors.faint,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 12,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#60a5fa',
    marginTop: 5,
    marginRight: 7,
  },
  objectiveText: {
    flex: 1,
    color: '#475569',
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginHorizontal: 3,
    marginBottom: 7,
  },
  conceptChip: {
    backgroundColor: colors.greenPanel,
    borderColor: '#d1fae5',
  },
  skillChip: {
    backgroundColor: colors.bluePanel,
    borderColor: '#dbeafe',
  },
  conceptText: {
    color: colors.green,
    fontSize: 8.5,
    fontWeight: 700,
  },
  skillText: {
    color: colors.brand,
    fontSize: 8.5,
    fontWeight: 700,
  },
  emptyText: {
    color: colors.faint,
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  pageHeading: {
    color: colors.brand,
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 18,
  },
  textPanel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
  },
  bodyText: {
    color: '#334155',
    fontSize: 10.5,
    lineHeight: 1.45,
  },
  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feedbackCard: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 7,
    padding: 11,
  },
  highlightCard: {
    backgroundColor: colors.greenPanel,
    borderColor: '#d1fae5',
  },
  challengeCard: {
    backgroundColor: colors.redPanel,
    borderColor: '#fee2e2',
  },
  highlightLabel: {
    color: '#059669',
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  challengeLabel: {
    color: '#dc2626',
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  highlightText: {
    color: '#064e3b',
    fontSize: 9,
    lineHeight: 1.35,
  },
  challengeText: {
    color: '#7f1d1d',
    fontSize: 9,
    lineHeight: 1.35,
  },
  quoteText: {
    color: '#334155',
    fontSize: 10.5,
    lineHeight: 1.45,
    fontStyle: 'italic',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: 160,
    marginBottom: 25,
  },
  imageFrame: {
    width: 160,
    height: 213,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  caption: {
    marginTop: 7,
    color: '#475569',
    fontSize: 8,
    lineHeight: 1.25,
    fontStyle: 'italic',
    fontWeight: 700,
    textAlign: 'center',
  },
  noImages: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  spacerLarge: {
    marginBottom: 24,
  },
  spacerMedium: {
    marginBottom: 20,
  },
  spacerSmall: {
    marginBottom: 14,
  },
  footer: {
    position: 'absolute',
    left: 45,
    right: 45,
    bottom: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBrand: {
    position: 'absolute',
    left: 45,
    bottom: 30,
  },
  footerPage: {
    position: 'absolute',
    right: 45,
    bottom: 30,
  },
  footerText: {
    color: colors.faint,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

function valueOrFallback(value: string, fallback = 'N/A') {
  return value.trim() || fallback;
}

function SectionTitle({
  children,
  centered = false,
}: {
  children: string;
  centered?: boolean;
}) {
  return (
    <Text style={[styles.sectionTitle, centered && styles.centeredTitle]}>
      {children}
    </Text>
  );
}

function Footer() {
  return (
    <>
      <View style={styles.footer} fixed />
      <Text style={[styles.footerText, styles.footerBrand]} fixed>
        EIM Technology Training
      </Text>
      <Text
        style={[styles.footerText, styles.footerPage]}
        fixed
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </>
  );
}

function Header({ data }: { data: ReportPdfData }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandBlock}>
        <Image src={COMPANY_LOGO} style={styles.logo} />
        <View>
          <Text style={styles.companyName}>{COMPANY_NAME}</Text>
          <Text style={styles.reportType}>Training Report</Text>
        </View>
      </View>
      <View style={styles.headerMeta}>
        <Text style={styles.headerDate}>{valueOrFallback(data.trainingDate)}</Text>
        {!!data.classNumber.trim() && (
          <Text style={styles.headerClass}>{data.classNumber}</Text>
        )}
        <Text style={styles.reportId}>REPORT ID: {data.reportId}</Text>
      </View>
    </View>
  );
}

function ChipList({
  items,
  variant,
  emptyLabel,
}: {
  items: string[];
  variant: 'concept' | 'skill';
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <Text style={styles.emptyText}>{emptyLabel}</Text>;
  }

  return (
    <View style={styles.chipWrap}>
      {items.map((item) => (
        <View
          key={item}
          style={[
            styles.chip,
            variant === 'concept' ? styles.conceptChip : styles.skillChip,
          ]}
        >
          <Text style={variant === 'concept' ? styles.conceptText : styles.skillText}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function TextSection({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <View style={styles.spacerMedium}>
      <SectionTitle>{title}</SectionTitle>
      <View style={styles.textPanel}>
        <Text style={styles.bodyText}>{children}</Text>
      </View>
    </View>
  );
}

export function ReportPdfDocument({ data }: { data: ReportPdfData }) {
  const galleryItems = data.images.reduce<
    { src: string; caption: string; index: number }[]
  >((items, src, index) => {
    if (src) {
      items.push({
        src,
        caption: data.imageCaptions[index]?.trim() || '',
        index,
      });
    }

    return items;
  }, []);

  return (
    <Document
      title={`EIM Training Report - ${valueOrFallback(data.studentName, 'Student')}`}
      author={COMPANY_NAME}
      subject="Training report"
      creator="EIM Training Report Generator"
      producer="EIM Training Report Generator"
    >
      <Page size="LETTER" style={styles.page}>
        <Header data={data} />

        <View style={[styles.row, styles.spacerLarge]}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Student Info</Text>
            <Text style={styles.infoName}>{valueOrFallback(data.studentName)}</Text>
            <Text style={styles.infoSub}>{valueOrFallback(data.studentEmail)}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Teacher Info</Text>
            <Text style={styles.infoName}>{valueOrFallback(data.teacherName)}</Text>
            <Text style={styles.infoSub}>{valueOrFallback(data.teacherEmail)}</Text>
          </View>
        </View>

        <View style={styles.spacerLarge}>
          <SectionTitle>Training Details</SectionTitle>
          <View style={styles.panel}>
            <Text style={styles.trainingTitle}>{valueOrFallback(data.trainingName)}</Text>
            <Text style={styles.microLabel}>Project Name</Text>
            <Text style={styles.projectName}>{valueOrFallback(data.projectName)}</Text>
            <Text style={styles.microLabel}>Objectives</Text>
            {data.objectives.length > 0 ? (
              data.objectives.map((objective, index) => (
                <View key={`${objective}-${index}`} style={styles.objectiveRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.objectiveText}>{objective}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No objectives defined</Text>
            )}
          </View>
        </View>

        <View style={styles.spacerLarge}>
          <SectionTitle centered>Concepts Developed</SectionTitle>
          <ChipList
            items={data.selectedConcepts}
            variant="concept"
            emptyLabel="No concepts selected"
          />
        </View>

        <View>
          <SectionTitle centered>Skills Developed</SectionTitle>
          <ChipList
            items={data.selectedSkills}
            variant="skill"
            emptyLabel="No skills selected"
          />
        </View>

        <Footer />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeading}>Training Feedback</Text>

        <TextSection title="Lesson Overview">
          {valueOrFallback(data.lessonOverview, 'No lesson overview provided.')}
        </TextSection>

        <View style={styles.spacerMedium}>
          <SectionTitle>Student Performance & Feedback</SectionTitle>
          <View style={styles.feedbackRow}>
            <View style={[styles.feedbackCard, styles.highlightCard]}>
              <Text style={styles.highlightLabel}>Highlight</Text>
              <Text style={styles.highlightText}>
                {valueOrFallback(data.highlight, 'Ongoing progress...')}
              </Text>
            </View>
            <View style={[styles.feedbackCard, styles.challengeCard]}>
              <Text style={styles.challengeLabel}>Challenge</Text>
              <Text style={styles.challengeText}>
                {valueOrFallback(data.challenge, 'Continuing development...')}
              </Text>
            </View>
          </View>
          <View style={styles.textPanel}>
            <Text style={styles.quoteText}>
              {"\"" + valueOrFallback(data.feedback, 'No specific feedback provided for this session.') + "\""}
            </Text>
          </View>
        </View>

        <TextSection title="Homework / Preview">
          {valueOrFallback(data.homework, 'No homework or next-class preview provided.')}
        </TextSection>

        <Footer />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeading}>Project Gallery</Text>

        {galleryItems.length > 0 ? (
          <View style={styles.galleryGrid}>
            {galleryItems.map((item) => (
              <View key={`${item.index}-${item.caption}`} style={styles.galleryItem}>
                <View style={styles.imageFrame}>
                  <Image src={item.src} style={styles.galleryImage} />
                </View>
                {!!item.caption && <Text style={styles.caption}>{item.caption}</Text>}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noImages}>
            <Text style={styles.emptyText}>No images provided</Text>
          </View>
        )}

        <Footer />
      </Page>
    </Document>
  );
}
