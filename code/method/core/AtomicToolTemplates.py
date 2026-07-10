AtomicToolTemplates = [
  {
    "id": "tool_001",
    "MetaInfo": {
      "Name": "FormulaCalculation",
      "Description": "Formula calculation category, primarily performing calculations for specific mathematical formulas, involving precise and complex numerical computations.",
      "Scope": "Applicable to scenarios requiring clear mathematical formulas for precise numerical calculation, e.g., geometry (area, volume), physics (velocity, acceleration), finance (compound interest, discounting). Not suitable for scenarios with conditional branches, lookup tables, or non-numeric outputs."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input includes all variables required for the formula. Each variable is a single numeric value (integer or float). No default values; all are required.",
        "Example": { "radius": 5, "formula": "3.1416 * radius ** 2" }
      },
      "Output": {
        "Description": "Output is a single numeric value (integer or float) representing the formula result, rounded to 4 decimal places at most.",
        "Example": { "result": 78.5400 }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": ["math"],
      "Logic": [
        "1. Import necessary libraries (e.g., math)",
        "2. Receive input parameters (including variable values and formula string)",
        "3. Replace variable names in the formula string with actual numeric values",
        "4. Evaluate the formula using eval or a safer alternative within a restricted namespace",
        "5. Round the result to 4 decimal places and return it"
      ]
    }
  },
  {
    "id": "tool_002",
    "MetaInfo": {
      "Name": "ConditionEvaluation",
      "Description": "Condition evaluation category, primarily performing condition expressions evaluation, outputting predefined condition result values.",
      "Scope": "Applicable to scenarios requiring conditional branching, e.g., medical risk stratification (low/medium/high), reference range comparison (normal/abnormal), score-based classification (mild/moderate/severe), and any logic with if-else or switch-case. Not suitable for continuous numerical calculations without branches."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input includes all variables required to evaluate the condition expression. Each parameter is a single element (numeric, boolean, or string). No default values; all are required.",
        "Example": { "value": 95, "low": 60, "high": 100 }
      },
      "Output": {
        "Description": "Output is a single value (string, numeric, or boolean) representing the condition evaluation result, e.g., classification label or predefined constant.",
        "Example": { "result": "Normal" }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": [],
      "Logic": [
        "1. Receive input parameters",
        "2. Evaluate the condition expressions in order (e.g., if-elif-else)",
        "3. Determine which condition branch is met",
        "4. Return the predefined result value corresponding to the matched branch",
        "5. If no condition matches, return a default value (e.g., 'Unknown')"
      ]
    }
  },
  {
    "id": "tool_003",
    "MetaInfo": {
      "Name": "DiscreteValueMapping",
      "Description": "Discrete value mapping category, primarily mapping finite input values to predefined output values (e.g., status code conversion, enum mapping, lab result classification).",
      "Scope": "Applicable to scenarios where a finite set of input values (e.g., integers, strings, enums) needs to be transformed into corresponding output values based on a predefined mapping table. Common in medical data normalization: converting lab result codes to readable labels, mapping diagnosis codes (ICD-10), transforming instrument status codes. Not suitable for continuous ranges or mathematical calculations."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input is a discrete value (integer, string, or boolean). Must be one of the keys defined in the mapping table. No default value; required.",
        "Example": { "input_code": "A12" }
      },
      "Output": {
        "Description": "Output is the corresponding mapped value (typically string or integer) from the mapping table. If input not found, returns a default value (e.g., 'Unknown').",
        "Example": { "result": "Positive" }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": [],
      "Logic": [
        "1. Receive the discrete input value",
        "2. Look up the input value as a key in the predefined mapping dictionary",
        "3. If the key exists, return the corresponding value",
        "4. If the key does not exist, return a default value (e.g., 'Unknown' or None)",
        "5. Optionally log unmapped keys for review"
      ]
    }
  },
  {
    "id": "tool_004",
    "MetaInfo": {
      "Name": "UnitConversion",
      "Description": "Unit conversion category, primarily converting numerical values from one unit to another (e.g., meters to inches, kilograms to pounds, mg/dL to mmol/L).",
      "Scope": "Applicable to scenarios requiring conversion between different units of measurement: length, mass, volume, concentration, time, temperature, etc. Common in medical contexts (e.g., glucose unit conversion: mg/dL ↔ mmol/L, creatinine unit conversion, height unit conversion: cm ↔ inches). Not suitable for non-linear conversions or conversions requiring contextual adjustments (e.g., temperature conversions use linear formulas)."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input is a numerical value (integer or float) in the original unit. The conversion factor and direction (from unit A to unit B) are predefined in the tool instance.",
        "Example": { "value": 175, "from_unit": "cm", "to_unit": "inches" }
      },
      "Output": {
        "Description": "Output is a numerical value (float) converted to the target unit, rounded to 4 decimal places at most.",
        "Example": { "result": 68.8976 }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": [],
      "Logic": [
        "1. Receive the input value and conversion direction",
        "2. Retrieve the predefined conversion factor (e.g., 1 inch = 2.54 cm)",
        "3. Apply the conversion formula: target_value = source_value * conversion_factor (or division, depending on direction)",
        "4. Round the result to 4 decimal places",
        "5. Return the converted value"
      ]
    }
  },
  {
    "id": "tool_005",
    "MetaInfo": {
      "Name": "StatisticalAggregation",
      "Description": "Statistical aggregation category, primarily performing statistical calculations on a set of data (e.g., sum, average, max, min, median, standard deviation).",
      "Scope": "Applicable to scenarios requiring aggregation of multiple numerical measurements into a single summary statistic. Common in medical contexts: calculating mean arterial pressure from multiple readings, maximum heart rate during stress test, median of lab values over time, sum of symptom scores, standard deviation of glucose measurements. Input is a list/array of numbers. Output is a single numeric value (except for range or multiple outputs, but this template focuses on single aggregated result). Not suitable for time-series analysis or complex statistical modeling."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input is a list or array of numerical values (integers or floats). Each element represents a single measurement. The list should contain at least one non-empty numeric value.",
        "Example": { "values": [120, 125, 130, 118, 122], "method": "mean" }
      },
      "Output": {
        "Description": "Output is a single numerical value (float) representing the aggregated statistical result (e.g., mean, sum, max, min, median), rounded to 4 decimal places.",
        "Example": { "result": 123.0000 }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": ["statistics"],
      "Logic": [
        "1. Receive the input list of numerical values and the aggregation method (e.g., 'mean', 'sum', 'max', 'min', 'median')",
        "2. Validate input: ensure list is not empty and contains only numeric types",
        "3. Select the appropriate function based on the method:",
        "   - 'sum': total = sum(values)",
        "   - 'mean': total = statistics.mean(values)",
        "   - 'max': total = max(values)",
        "   - 'min': total = min(values)",
        "   - 'median': total = statistics.median(values)",
        "4. Round the result to 4 decimal places",
        "5. Return the aggregated value"
      ]
    }
  },
  {
    "id": "tool_006",
    "MetaInfo": {
      "Name": "LogicalCombination",
      "Description": "Logical combination category, primarily performing logical operations on a set of boolean values (AND, OR, NOT).",
      "Scope": "Applicable to scenarios requiring combination of multiple boolean conditions into a single logical decision. Common in medical contexts: determining if a patient meets multiple risk factors (e.g., age > 65 AND smoking history AND hypertension), eligibility for a clinical trial (inclusion criteria all true OR exclusion criteria any true), alert triggering (abnormal lab value OR critical vital sign). Inputs are boolean values; output is a single boolean (true/false). NOT operations can be applied to individual inputs. Suitable for any rule-based logic where multiple conditions need to be evaluated together. Not suitable for fuzzy logic or weighted scoring."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input is a set of boolean values (true/false) and the logical operator(s) to combine them (AND, OR, NOT). Operators can be specified as a string or implied by the tool instance configuration.",
        "Example": { "conditions": [True, False, True], "operator": "AND" }
      },
      "Output": {
        "Description": "Output is a single boolean value (true or false) representing the result of the logical expression.",
        "Example": { "result": False }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": [],
      "Logic": [
        "1. Receive a list of boolean values and the logical operator (AND, OR, or NOT)",
        "2. Validate input: ensure list is not empty and contains only boolean types",
        "3. Apply the operator:",
        "   - AND: return True only if all values are True",
        "   - OR: return True if at least one value is True",
        "   - NOT: (for single input) return the negation of the input",
        "4. Return the boolean result"
      ]
    }
  },
  {
    "id": "tool_007",
    "MetaInfo": {
      "Name": "TimeSeriesProcessing",
      "Description": "Time series processing category, performing operations on time data (e.g., date difference, format conversion, duration calculation).",
      "Scope": "Applicable to scenarios requiring manipulation or calculation with dates, times, or durations. Common in medical contexts: calculating patient age from birth date, days between hospital admission and discharge, gestational age conversion (weeks+days), time intervals between medication doses, converting date strings between formats (e.g., YYYY-MM-DD to DD/MM/YYYY). Inputs are datetime strings or date objects. Outputs can be numeric (e.g., age in years/days), formatted strings, or duration objects. Not suitable for complex time series forecasting or irregular time series interpolation."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input includes one or more time values as strings (ISO format recommended) and optionally a specified operation (e.g., 'date_diff', 'format_convert', 'add_days').",
        "Example": { "start_date": "2024-01-15", "end_date": "2024-03-20", "operation": "days_difference" }
      },
      "Output": {
        "Description": "Output depends on the operation: numeric (days/years difference, rounded to 4 decimal places if fractional), string (formatted date), or date object.",
        "Example": { "result": 65.0000 }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": ["datetime"],
      "Logic": [
        "1. Import datetime library (e.g., datetime.datetime, datetime.timedelta)",
        "2. Parse input time strings into datetime objects (handle multiple formats)",
        "3. Based on the specified operation:",
        "   - date_diff: subtract two dates, return total days (as float) or years (days/365.25, rounded to 4 decimals)",
        "   - format_convert: convert date string from source format to target format",
        "   - add_days: add/subtract days from a date and return new date string",
        "   - age_calculation: compute age in years from birth date to reference date",
        "4. Return the processed result (string, integer, or float rounded to 4 decimals)"
      ]
    },
  },
  {
    "id": "tool_008",
    "MetaInfo": {
      "Name": "ThresholdMapping",
      "Description": "Threshold mapping category, mapping continuous numerical values to discrete values based on predefined thresholds.",
      "Scope": "Applicable to scenarios where a continuous numerical value needs to be categorized into discrete bins or levels based on cutoff values. Common in medical contexts: blood pressure classification (Normal/Elevated/Stage1/Stage2), BMI categories (Underweight/Normal/Overweight/Obese), eGFR staging (CKD Stage 1-5), cholesterol risk levels, tumor grading based on size. Input is a single numerical value. Output is a categorical label (string or code). Not suitable for scenarios requiring probability or fuzzy membership, only crisp threshold boundaries."
    },
    "FlowInfo": {
      "Input": {
        "Description": "Input is a single numerical value (integer or float) to be evaluated against predefined thresholds. Thresholds and their corresponding output labels are defined in the tool instance.",
        "Example": { "value": 28.5 }
      },
      "Output": {
        "Description": "Output is a discrete category label (typically string) corresponding to the threshold range into which the input falls. If value is outside all defined ranges, a default label (e.g., 'Out of Range') is returned.",
        "Example": { "category": "Overweight" }
      }
    },
    "ExecInfo": {
      "Language": "python",
      "Library": [],
      "Logic": [
        "1. Receive the input numerical value",
        "2. Retrieve the predefined threshold mapping: a list of (lower_bound, upper_bound, label) tuples, sorted by range",
        "3. Check if the value falls into any defined range (inclusive of lower bound, exclusive of upper bound, or as defined)",
        "4. If a match is found, return the corresponding label",
        "5. If no range matches (value too low or too high), return a default label (e.g., 'Below Range' or 'Above Range')"
      ]
    }
  }
]