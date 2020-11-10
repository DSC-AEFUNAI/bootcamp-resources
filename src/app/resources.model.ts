export interface Resource {
  title: String;
  description: String;
  objectives: String[];  
}

export interface IntroResource extends Resource {
  requirments: String[];
};

export interface DailyResource extends Resource {
  links: String[];
  assignment: String;
  corrections: String[];
};