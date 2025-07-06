const data = [
    [
        {
            que_type: 'pre-que',
            year: 2020,
            marks: 2,
            subject: 'Environment & Ecology',
            question:
              "With reference to the 'New York Declaration on Forests', which of the following statements are correct?\n\n1. It was first endorsed at the United Nations Climate Summit in 2014.\n2. It endorses a global timeline to end the loss of forests.\n3. It is a legally binding international declaration.\n4. It is endorsed by governments, big companies, and indigenous communities.\n\nSelect the correct answer using the code given below:",
            options: [
              {
                option: 'A',
                text: '1, 2 and 4 only',
              },
              {
                option: 'B',
                text: '1 and 3 only',
              },
              {
                option: 'C',
                text: '3 and 4 only',
              },
              {
                option: 'D',
                text: '1, 2, 3 and 4',
              },
            ],
            correctOption: 'A',
            answer:
              'Statement 1 is correct: The declaration was first endorsed at the 2014 UN Climate Summit. Statement 2 is correct: It aims to halve deforestation by 2020 and end it by 2030. Statement 3 is incorrect: The declaration is not legally binding. Statement 4 is correct: It is endorsed by governments, corporations, and indigenous communities.',
            show_answer: false,
          }, 
    ],
    [
        {
        que_type: 'mains-que',
        year: 2020,
        paper: 'GS Paper III',
        marks: 15,
        question:
          'Explain the meaning of investment in an economy and the effect of interest rate on it. Also, explain the role of the public investment in crowding-in private investment.',
        answer:
          'Investment refers to capital formation in an economy. Lower interest rates encourage private investment. Public investment improves infrastructure and confidence, thereby crowding-in private investment through complementary and multiplier effects.',
        show_answer: false,
      },
    ]
  ];
  
  export default data;
  