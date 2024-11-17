const jobsData = {
  Immediate: {
    jobs: [
      {
        title: "Looking for graphic designer for branding project",
        budget: "Rs.10K",
        deadline: "5 Days",
        description:
          "We need a designer for a health agency rebranding that deals with various sectors in...",
      },
      {
        title: "Need logo designer for startup project",
        budget: "Rs.15K",
        deadline: "3 Days",
        description:
          "A tech startup is looking for a designer to create a minimalistic logo...",
      },
      {
        title: "Urgent: Social Media Manager for Ad Campaign",
        budget: "Rs.20K",
        deadline: "2 Days",
        description:
          "We need a social media expert to manage a short-term campaign for a product launch...",
      },
      {
        title: "Emergency: Network Administrator Required",
        budget: "Rs.30K",
        deadline: "1 Day",
        description:
          "A company is facing critical network downtime and requires an immediate fix from an experienced network administrator...",
      },
      {
        title: "Need logo designer for startup project",
        budget: "Rs.15K",
        deadline: "3 Days",
        description:
          "A tech startup is looking for a designer to create a minimalistic logo...",
      },
      {
        title: "Urgent: Social Media Manager for Ad Campaign",
        budget: "Rs.20K",
        deadline: "2 Days",
        description:
          "We need a social media expert to manage a short-term campaign for a product launch...",
      },
    ],
  },
  High: {
    jobs: [
      {
        title: "Web Developer Needed for E-Commerce Site",
        budget: "Rs.50K",
        deadline: "10 Days",
        description:
          "We are seeking a developer to create an e-commerce platform with payment gateway integration...",
      },
      {
        title: "Mobile App Developer for Healthcare App",
        budget: "Rs.80K",
        deadline: "15 Days",
        description:
          "A healthcare company is looking for a developer to create a cross-platform mobile app...",
      },
      {
        title: "Digital Marketing Expert for B2B Strategy",
        budget: "Rs.60K",
        deadline: "12 Days",
        description:
          "A B2B company is in need of a marketing expert to design and implement a digital strategy...",
      },
      {
        title: "Data Scientist for Predictive Analysis",
        budget: "Rs.75K",
        deadline: "14 Days",
        description:
          "A tech company is seeking a data scientist to perform predictive analysis for their sales data...",
      },
    ],
  },
  Standard: {
    jobs: [
      {
        title: "Content Writer for Blog Articles",
        budget: "Rs.5K",
        deadline: "7 Days",
        description:
          "Looking for a content writer to produce high-quality blog articles on technology topics...",
      },
      {
        title: "SEO Specialist for E-Commerce Site",
        budget: "Rs.12K",
        deadline: "12 Days",
        description:
          "An SEO specialist is needed to improve the search engine ranking of our e-commerce site...",
      },
      {
        title: "Junior Graphic Designer for Marketing Material",
        budget: "Rs.8K",
        deadline: "6 Days",
        description:
          "A junior designer is needed to create marketing material for a product launch...",
      },
      {
        title: "Backend Developer for API Development",
        budget: "Rs.25K",
        deadline: "8 Days",
        description:
          "An API developer is needed to create a backend for a fintech startup’s web platform...",
      },
    ],
  },
  Consulting: {
    jobs: [
      {
        title: "Business Consultant for Process Optimization",
        budget: "Rs.60K",
        deadline: "10 Days",
        description:
          "We are looking for a business consultant to optimize workflows and increase efficiency...",
      },
      {
        title: "Financial Advisor for Investment Strategies",
        budget: "Rs.100K",
        deadline: "20 Days",
        description:
          "A financial advisory firm needs an expert to provide strategic investment advice to high-net-worth clients...",
      },
      {
        title: "HR Consultant for Employee Engagement Program",
        budget: "Rs.40K",
        deadline: "7 Days",
        description:
          "An HR consultant is required to develop an employee engagement program for a midsize company...",
      },
    ],
  },
  Engineering: {
    jobs: [
      {
        title: "Mechanical Engineer for Manufacturing Project",
        budget: "Rs.70K",
        deadline: "30 Days",
        description:
          "A manufacturing firm is looking for an experienced mechanical engineer to oversee a production line...",
      },
      {
        title: "Civil Engineer for Bridge Design",
        budget: "Rs.120K",
        deadline: "45 Days",
        description:
          "A construction company requires a civil engineer for the design of a new bridge...",
      },
      {
        title: "Electrical Engineer for Circuit Design",
        budget: "Rs.50K",
        deadline: "20 Days",
        description:
          "An electronics company is looking for an electrical engineer to design circuits for a new product...",
      },
    ],
  },
  IT: {
    jobs: [
      {
        title: "Cybersecurity Expert for Penetration Testing",
        budget: "Rs.90K",
        deadline: "15 Days",
        description:
          "A company needs a cybersecurity expert to perform penetration testing on their systems...",
      },
      {
        title: "Cloud Architect for AWS Setup",
        budget: "Rs.120K",
        deadline: "25 Days",
        description:
          "We are looking for a cloud architect to set up and manage an AWS infrastructure...",
      },
      {
        title: "DevOps Engineer for CI/CD Pipeline Setup",
        budget: "Rs.85K",
        deadline: "10 Days",
        description:
          "A startup needs a DevOps engineer to build and manage a CI/CD pipeline for their software development...",
      },
    ],
  },
};

const reviews = [
  {
    reviewerName: "Josaph Niloy",
    reviewerLocation: "United States of America",
    starRating: 5,
    reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
  },
  {
    reviewerName: "Alina Broke",
    reviewerLocation: "Canada",
    starRating: 5,
    reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    reviewerName: "Josaph Niloy",
    reviewerLocation: "United States of America",
    starRating: 5,
    reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
  },
  {
    reviewerName: "Alina Broke",
    reviewerLocation: "Canada",
    starRating: 5,
    reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    reviewerName: "Josaph Niloy",
    reviewerLocation: "United States of America",
    starRating: 5,
    reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
  },
  {
    reviewerName: "Alina Broke",
    reviewerLocation: "Canada",
    starRating: 5,
    reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
  },
  {
    reviewerName: "Josaph Niloy",
    reviewerLocation: "United States of America",
    starRating: 5,
    reviewText: "Lorem Ipsum is simply dummy text of the printing industry...",
  },
  {
    reviewerName: "Alina Broke",
    reviewerLocation: "Canada",
    starRating: 5,
    reviewText: "Lorem Ipsum has been the industry's standard dummy text...",
  },
];

export {jobsData, reviews}