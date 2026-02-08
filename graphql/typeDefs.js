const { gql } = require("graphql-tag");

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phone: String!
    role: Role!
    status: Status!
    studentProfile: Student
    teacherProfile: Teacher
    adminProfile: Admin
    createdAt: Date!
  }

  type Student {
    id: ID!
    userId: ID!
    user: User!
    parentName: String!
    educationLevel: EducationLevel!
    currentYear: String
    credit: Float!
    enrolledSubjects: [Subject!]
    createdAt: Date!
  }

  type Teacher {
    id: ID!
    userId: ID!
    user: User!
    subjects: [String!]
    educationLevels: [EducationLevel!]
    credit: Float!
    totalEarnings: Float!
    withdrawable: Float!
    bankInfo: BankInfo
    selectedSubjects: [Subject!]
    ratingsStats: RatingsStats # ← AJOUTÉ
    createdAt: Date!
  }

  type Admin {
    id: ID!
    userId: ID!
    user: User!
    department: String
    permissions: [String!]
    lastLogin: Date
    createdAt: Date!
  }

  type StudentProfile {
    parentName: String
    educationLevel: EducationLevel
    currentYear: String
    enrolledSubjects: [Subject!]
  }

  type TeacherProfile {
    subjects: [String!]
    educationLevels: [EducationLevel!]
    totalEarnings: Float!
    withdrawable: Float!
    bankInfo: BankInfo
  }

  type AdminProfile {
    permissions: [String!]
    department: String
    lastLogin: Date
  }

  type BankInfo {
    accountHolder: String
    iban: String
    bankName: String
  }

  type ContentStats {
    totalVideos: Int!
    totalPdfs: Int!
    totalDuration: Int!
    totalSize: Int!
  }

  # ========================================
  # NOUVEAU : RATINGS STATS
  # ========================================
  type RatingsStats {
    averageRating: Float!
    totalRatings: Int!
    ratingDistribution: RatingDistribution!
  }

  type RatingDistribution {
    one: Int! # Note: GraphQL n'accepte pas les noms de champs commençant par un chiffre
    two: Int!
    three: Int!
    four: Int!
    five: Int!
  }

  type Video {
    id: ID!
    title: String!
    description: String
    url: String!
    publicId: String!
    duration: Int
    fileSize: Int
    format: String
    width: Int
    height: Int
    uploadedBy: Teacher
    uploadedAt: Date!
    order: Int
  }

  type PDF {
    id: ID!
    title: String!
    description: String
    url: String!
    publicId: String!
    fileSize: Int
    pageCount: Int
    uploadedBy: Teacher
    uploadedAt: Date!
  }

  type Subject {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String
    level: Level!
    status: SubjectStatus!
    assignedTeachers: [AssignedTeacher!]
    enrolledStudents: [EnrolledStudent!]
    stats: SubjectStats!
    videos: [Video!]
    pdfs: [PDF!]
    contentStats: ContentStats
    ratingsStats: RatingsStats # ← AJOUTÉ
    createdAt: Date!
  }

  type AssignedTeacher {
    teacherId: ID!
    teacher: Teacher!
    userId: ID!
    user: User!
    assignedAt: Date!
  }

  type EnrolledStudent {
    studentId: ID!
    student: Student!
    userId: ID!
    user: User!
    enrolledAt: Date!
    progress: Float!
  }

  type Transaction {
    id: ID!
    student: User
    teacher: User
    subject: Subject
    amount: Float!
    type: TransactionType!
    teacherCut: Float!
    companyCut: Float!
    description: String
    status: TransactionStatus!
    createdAt: Date!
  }

  type Message {
    id: ID!
    sender: User!
    recipient: User!
    subject: Subject
    content: String!
    isRead: Boolean!
    createdAt: Date!
  }

  type SubjectStats {
    totalSales: Int!
    revenue: Float!
    studentsEnrolled: Int!
    teachersCount: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type AIResponse {
    answer: String!
    pointsCharged: Float!
    remainingCredit: Float!
  }

  type DashboardStats {
    totalStudents: Int!
    totalTeachers: Int!
    totalSubjects: Int!
    totalRevenue: Float!
    totalTransactions: Int!
    recentTransactions: [Transaction!]
  }

  type Rating {
    id: ID!
    student: Student!
    studentUserId: ID!
    targetType: RatingTargetType!
    video: ID
    pdf: ID
    subject: Subject
    teacher: Teacher
    rating: Int!
    comment: String
    createdAt: Date!
    updatedAt: Date!
  }

  type VideoProgress {
    id: ID!
    student: Student!
    subject: Subject!
    videoId: ID!
    watchedTime: Int!
    completionPercentage: Float!
    completed: Boolean!
    lastPosition: Int!
    lastWatchedAt: Date!
  }

  type PDFProgress {
    id: ID!
    student: Student!
    subject: Subject!
    pdfId: ID!
    pagesRead: [Int!]!
    lastPage: Int!
    completionPercentage: Float!
    completed: Boolean!
    lastReadAt: Date!
  }

  type SubjectWithProgress {
    subject: Subject!
    overallProgress: Float!
    videosProgress: [VideoProgress!]!
    pdfsProgress: [PDFProgress!]!
    ratings: [Rating!]!
  }

  enum RatingTargetType {
    VIDEO
    PDF
    SUBJECT
    TEACHER
  }

  enum EducationLevel {
    PRIMAIRE
    CEM
    LYCEE
    SUPERIEUR
  }

  enum Role {
    STUDENT
    TEACHER
    ADMIN
    SUPER_ADMIN
    DESKTOP_USER
  }

  enum Status {
    ACTIVE
    INACTIVE
  }

  enum Level {
    PRIMAIRE
    COLLEGE
    LYCEE
    SUPERIEUR
  }

  enum SubjectStatus {
    ACTIVE
    INACTIVE
    DRAFT
  }

  enum TransactionType {
    PURCHASE
    SUBJECT_BUY
    AI_USE
    WITHDRAWAL
    REFUND
  }

  enum TransactionStatus {
    PENDING
    COMPLETED
    FAILED
    CANCELLED
  }

  type Query {
    # Auth
    me: User
    myProfile: ProfileUnion

    # Users
    users(role: Role, status: Status): [User!]!
    user(id: ID!): User

    # Students
    students: [Student!]!
    student(id: ID!): Student

    # Teachers
    teachers: [Teacher!]!
    teacher(id: ID!): Teacher

    # Admins
    admins: [Admin!]!
    admin(id: ID!): Admin

    # Subjects
    subjects(teacherId: ID, level: Level, status: SubjectStatus): [Subject!]!
    subject(id: ID!): Subject
    mySubjects: [Subject!]!
    myPurchasedSubjects: [Subject!]!

    # Transactions
    myTransactions: [Transaction!]!
    userTransactions(userId: ID!): [Transaction!]!
    allTransactions(type: TransactionType): [Transaction!]!

    # Messages
    myMessages(recipientId: ID): [Message!]!
    conversation(userId: ID!): [Message!]!

    # Stats
    dashboardStats: DashboardStats!
    teacherEarnings: Float!

    # Progression
    myProgress: [SubjectWithProgress!]!
    subjectProgress(subjectId: ID!): SubjectWithProgress

    # Évaluations
    subjectRatings(subjectId: ID!): [Rating!]!
    teacherRatings(teacherId: ID!): [Rating!]!
    myRatings: [Rating!]!
  }

  union ProfileUnion = Student | Teacher | Admin

  type Mutation {
    # Auth
    register(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      phone: String!
      role: Role!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    # Create Profiles
    createStudentProfile(
      userId: ID!
      parentName: String!
      educationLevel: EducationLevel!
      currentYear: String
    ): Student!

    createTeacherProfile(
      userId: ID!
      subjects: [String!]
      educationLevels: [EducationLevel!]
      selectedSubjects: [ID!]
    ): Teacher!

    createAdminProfile(
      userId: ID!
      department: String
      permissions: [String!]
    ): Admin!

    # User management
    updateUser(
      id: ID!
      firstName: String
      lastName: String
      phone: String
      status: Status
    ): User!

    updateCredit(userId: ID!, amount: Float!): User!

    # Points
    purchasePoints(amount: Float!): Transaction!

    # Subjects
    createSubject(
      name: String!
      description: String!
      price: Float!
      category: String
      level: Level!
    ): Subject!

    updateSubject(
      id: ID!
      name: String
      description: String
      price: Float
      status: SubjectStatus
    ): Subject!

    deleteSubject(id: ID!): Boolean!

    assignTeacherToSubject(subjectId: ID!, teacherId: ID!): Subject!
    removeTeacherFromSubject(subjectId: ID!, teacherId: ID!): Subject!

    buySubject(subjectId: ID!): Transaction!

    # Content
    deleteVideo(subjectId: ID!, videoId: ID!): Subject!
    deletePDF(subjectId: ID!, pdfId: ID!): Subject!

    # Progression
    updateVideoProgress(
      subjectId: ID!
      videoId: ID!
      watchedTime: Int!
      lastPosition: Int!
    ): VideoProgress!

    updatePDFProgress(
      subjectId: ID!
      pdfId: ID!
      pagesRead: [Int!]!
      lastPage: Int!
    ): PDFProgress!

    # Évaluations
    rateVideo(
      subjectId: ID!
      videoId: ID!
      rating: Int!
      comment: String
    ): Rating!

    ratePDF(subjectId: ID!, pdfId: ID!, rating: Int!, comment: String): Rating!

    rateSubject(subjectId: ID!, rating: Int!, comment: String): Rating!

    rateTeacher(teacherId: ID!, rating: Int!, comment: String): Rating!

    updateRating(ratingId: ID!, rating: Int!, comment: String): Rating!

    deleteRating(ratingId: ID!): Boolean!

    # Messages
    sendMessage(recipientId: ID!, subjectId: ID, content: String!): Message!

    markMessageAsRead(id: ID!): Message!

    # Withdrawal
    requestWithdrawal(amount: Float!): Transaction!
    # Admin Actions
    toggleUserStatus(userId: ID!): User!
        createAdminUser(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      phone: String!
      department: String
      permissions: [String!]
    ): AuthPayload!
  }


`;

module.exports = typeDefs;
