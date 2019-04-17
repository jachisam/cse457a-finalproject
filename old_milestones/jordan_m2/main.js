
    let gauge1, config1;
    createGauge();


    const intercept = -1.275725;
    // used Applicant #9
    //9,302,102,1,2,1.5,8,0,0.5
    let cgpa = 8.0*0.118385, gre = 302*0.001859, lor = 1.5*0.016859, research = 0*0.024307, sop = 2*0.001586, toefl = 102*0.002778, universityRating = 1*0.005941;
    // let cgpa = 0, gre = 0, lor = 0, research = 0, sop = 0, toefl = 0, universityRating = 0;
    let formula = 0;
    function recalculate_formula(){
      formula = 100*(intercept+cgpa+gre+lor+research+sop+toefl+universityRating);
      return formula;
    }
    // console.log(recalculate_formula());

    function cgpa_calculation(){
      const cgpa_coef = 0.118385;
      let val = document.getElementById("cgpa").innerHTML;
      cgpa = cgpa_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      // return cgpa;
    }

    function gre_calculation(){
      const gre_coef = 0.001859;
      let val = document.getElementById("gre").innerHTML;
      gre = gre_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      // gauge1.update(gre);
      // return gre;
    }

    function lor_calculation(){
      const lor_coef = 0.016859;
      let val = document.getElementById("lor").innerHTML;
      lor = lor_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      // return lor;
    }

    function research_calculation(){
      const research_coef = 0.024307;
      let val = document.getElementById("research").innerHTML;
      research = research_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      //return research_coef*val;
    }

    function sop_calculation(){
      const sop_coef = 0.001586;
      let val = document.getElementById("sop").innerHTML;
      sop = sop_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      //return sop;
    }

    function toefl_calculation(){
      const toefl_coef = 0.002778;
      let val = document.getElementById("toefl").innerHTML;
      toefl = toefl_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      // return toefl;
    }

    function universityRating_calculation(){
      const universityRating_coef = 0.005941;
      let val = document.getElementById("universityRating").innerHTML;
      universityRating = universityRating_coef*val;
      recalculate_formula();
      gauge1.update(formula);
      //return universityRating;
    }

    function chanceOfAdmittance_calculation(){
      let val = document.getElementById("chanceOfAdmittance").innerHTML;
      return val;
    }

    function createGauge(){
      gauge1 = loadLiquidFillGauge("fillgauge1", 50);
      config1 = liquidFillGaugeDefaultSettings();
      config1.circleColor = "#FF7777";
      config1.textColor = "#FF4444";
      // http://html-color.org/FFAAAA
      // config1.waveTextColor = "#A9D4FF";
      config1.waveColor = "#FFAAAA";
      // config1.waveColor = "#A9FFD4";
      // config1.waveColor = "#FFDDDD";

      config1.circleThickness = 0.2;
      config1.circleFillGap = 0.2;
      config1.textVertPosition = 0.2;
      config1.waveAnimateTime = 2000;
      config1.waveHeight = 0.7;
      config1.waveCount = 1;
    }
