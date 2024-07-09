import React from "react";
import "./quizIntractive.scss";
import deepcopy from "deepcopy";

import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface AnswersData {
  text: string;
  isCorrect?: boolean;
}

interface QuestionsData {
  text: string;
  type: string;
  answers: Array<AnswersData>;
  feedback?: string;
}

interface QuestionData {
  interactiveTitle?: string;
  questionPool: Array<QuestionsData>;
}

interface PropType {
  src?: string;
}
interface StateType {
  langData: object;
  questionData: QuestionData;
  displayState: string;
  currentQuestion: number;
}

class IntractiveWrapper extends React.Component<PropType, StateType> {
  ref: any = null;
  usingDataSrc: string = "";
  supportedLangs: Array<string> = ["en", "fr-ca"];
  defaultLang: string = "en";
  langSelection: string = this.defaultLang;
  stepperSteps: Array<{ label: string; description: string }> = [];
  correctResponce: boolean = false;
  score: number = 0;

  state = {
    langData: {},
    questionData: {
      interactiveTitle: "Data Load Failure",
      questionPool: [
        {
          text: "a question",
          type: "single",
          answers: [
            { text: "true" },
            {
              text: "false",
              isCorrect: true,
            },
          ],
          feedback: "",
        },
      ],
    },
    displayState: "question",
    currentQuestion: 0,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount = () => {
    //this.getLangData();
    console.log("MpsPlayer ready");

    if ((window as any).qq_srcOverride) {
      this.usingDataSrc = (window as any).qq_srcOverride as string;
    }
    // if ((window as any).parent && (window as any).parent.qq_srcOverride) {
    //   this.usingDataSrc = (window as any).parent.qq_srcOverride as string;
    // }
    else if (this.props.src) {
      this.usingDataSrc = this.props.src;
    } else {
      this.usingDataSrc = "./sample.json";
    }

    this.getQuestionData().then(() => {
      //this.shuffleAnswerData().then();
    });
  };

  getLangData = () => {
    return new Promise((resolve, reject) => {
      if ((window as any).qq_langOverride) {
        if (
          this.supportedLangs.indexOf((window as any).qq_langOverride) === -1
        ) {
          this.langSelection = (window as any).qq_srcOverride as string;
        } else {
          console.warn(
            `provided lang overide ${
              (window as any).qq_srcOverride
            } is not availible`
          );
        }
      }

      fetch(`./lang/${this.langSelection}.json`)
        .then((response) => response.json())
        .then((publicLangData: object) => {
          this.setState(
            {
              langData: publicLangData,
            },
            () => {
              resolve(this.state.langData);
            }
          );
        });
    });
  };

  getQuestionData = () => {
    return new Promise((resolve, reject) => {
      fetch(this.usingDataSrc)
        .then((response) => response.json())
        .then((publicQuestionData: QuestionData) => {
          this.setState(
            {
              questionData: publicQuestionData,
            },
            () => {
              resolve(this.state.questionData);
            }
          );
        });
    });
  };

  /*
  shuffleAnswerData = () => {
    return new Promise((resolve, reject) => {
      // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      let qDataCopy = deepcopy(this.state.questionData);
      let array = qDataCopy.answers;
      let currentIndex = array.length;
      while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      qDataCopy.answers = array;

      this.setState(
        {
          questionData: qDataCopy,
        },
        () => {
          resolve(array);
        }
      );

      return array;
    });
  };
  */

  langKey = (key: string) => {
    return this.state.langData[key] as string;
  };

  /*
  defineStepper = () => {
    this.stepperSteps = [];
    for (let ans = 0; ans < this.state.questionData.answers.length; ans++) {
      this.stepperSteps.push({
        label:
          this.state.questionData.questions[this.state.currentQuestion].text,
        description: this.state.questionData.answers[ans].text,
      });
    }
  };

  handleNextStep = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handlePreviousStep = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };
*/

  handleAnswerSelection = () => {
    // this.correctResponce =
    //   this.state.questionData.answers[this.state.activeStep].key ===
    //   this.state.questionData.questions[this.state.currentQuestion].answerKey;
    // this.setState({ displayState: "feedback" });
  };

  handleNextQuestionSelection = () => {
    // if (
    //   this.state.currentQuestion + 1 >=
    //   this.state.questionData.questions.length
    // ) {
    //   this.setState({
    //     currentQuestion: 0,
    //     displayState: "end",
    //     activeStep: 0,
    //   });
    // } else {
    //   this.setState({
    //     currentQuestion: this.state.currentQuestion + 1,
    //     displayState: "question",
    //     activeStep: 0,
    //   });
    // }
  };

  handleReset = () => {
    // this.shuffleAnswerData();
    this.score = 0;
    this.setState({
      displayState: "question",
    });
  };

  render() {
    const buildHeader = () => {
      if (this.state.questionData.interactiveTitle) {
        return (
          <h2 className="qq_header">
            {this.state.questionData.interactiveTitle}
          </h2>
        );
      } else {
        return "";
      }
    };

    const buildQuestionDisplayState = () => {
      let qid = `qq_q${this.state.currentQuestion}`;
      const listItems = this.state.questionData.questionPool[
        this.state.currentQuestion
      ].answers.map((ans: AnswersData, index: number) => {
        return (
          <FormControlLabel
            id={qid + "_a" + index}
            key={qid + "_a" + index}
            className="qq_answerText"
            control={<Radio id={qid + "_a" + index + "_radio"} />}
            value={index}
            label={
              this.state.questionData.questionPool[this.state.currentQuestion]
                .answers[index].text
            }
          />
        );
      });

      return (
        <Box className="qq_questionDisplay">
          <Box className="qq_questionText">
            <h3>
              Question {this.state.currentQuestion + 1} of{" "}
              {this.state.questionData.questionPool.length}
            </h3>

            <FormControl id={qid + "_fc"}>
              <FormLabel id={qid + "_fcLable"}>
                {
                  this.state.questionData.questionPool[
                    this.state.currentQuestion
                  ].text
                }
              </FormLabel>
              <RadioGroup
                id={qid + "_fcRadGroup"}
                aria-labelledby="potential answers"
              >
                {listItems}
              </RadioGroup>
            </FormControl>
          </Box>
          <hr />
          {}
          {/* <MobileStepper
            variant="text"
            steps={this.state.questionData.answers.length}
            position="static"
            activeStep={this.state.activeStep}
            nextButton={
              <Button
                size="small"
                onClick={this.handleNextStep}
                disabled={
                  this.state.activeStep ===
                  this.state.questionData.answers.length - 1
                }
              >
                Next <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={this.handlePreviousStep}
                disabled={this.state.activeStep === 0}
              >
                <KeyboardArrowLeft /> Back
              </Button>
            }
          /> */}
          <Box className="qq_answerButtonContainer">
            <Button
              variant="contained"
              size="medium"
              onClick={this.handleAnswerSelection}
            >
              Select Answer
            </Button>
          </Box>
        </Box>
      );
    };

    const buildFeedbackDisplayState = () => {
      const correctStatusDisplay = () => {
        if (this.correctResponce) {
          this.score++;
          return (
            <Box className="qq_isCorrectIndicator qq_correct">Correct!</Box>
          );
        } else {
          return (
            <Box className="qq_isCorrectIndicator qq_incorrect">Incorrect</Box>
          );
        }
      };

      return (
        <Box className="qq_feedbackDisplay">
          {correctStatusDisplay()}
          <p>
            {
              this.state.questionData.questionPool[this.state.currentQuestion]
                .feedback
            }
          </p>
          <Button
            variant="contained"
            size="medium"
            onClick={this.handleNextQuestionSelection}
          >
            Next Question
          </Button>
        </Box>
      );
    };

    const buildEndScreenDisplayState = () => {
      return (
        <Box className="qq_endScreenDisplay">
          <p>
            Congratulations! You've scored {this.score} of{" "}
            {this.state.questionData.questionPool.length}
          </p>
          <Button variant="contained" size="medium" onClick={this.handleReset}>
            Reset
          </Button>
        </Box>
      );
    };

    const setDisplayState = () => {
      if (this.state.displayState === "question") {
        return <div>{buildQuestionDisplayState()}</div>;
      } else if (this.state.displayState === "feedback") {
        return <div>{buildFeedbackDisplayState()}</div>;
      } else if (this.state.displayState === "end") {
        return <div>{buildEndScreenDisplayState()}</div>;
      } else {
        console.error(`invaild display state ${this.state.displayState}`);
      }
    };

    return (
      <Box className="sortingInteractive">
        {buildHeader()}
        <div className="instructionText">
          <p>
            <strong> Instructions: </strong> Select the arrow buttons to cycle
            for best response to the following statment.Once you have selected
            the best responce, check your answer with the button below.
          </p>
        </div>
        {setDisplayState()}
      </Box>
    );
  }
}

export default IntractiveWrapper;