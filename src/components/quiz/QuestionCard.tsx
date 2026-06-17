import { CheckCircle2, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Lightbulb, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Question, type Language } from "@/data/questions";
import { translations } from "@/data/translations";

const questionDocLinks: Record<number, string> = {
  // Segurança e Governança (Q1-Q15)
  1: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls",
  2: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-security-sensitivity-label-overview",
  3: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-ols",
  4: "https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-roles-new-workspaces",
  5: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls#validate-the-roles",
  6: "https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-create-distribute-apps",
  7: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-security-sensitivity-label-downstream-inheritance",
  8: "https://learn.microsoft.com/en-us/power-bi/admin/service-admin-auditing",
  9: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls#using-the-username-or-userprincipalname-dax-function",
  10: "https://learn.microsoft.com/en-us/power-bi/admin/service-admin-portal-export-sharing",
  11: "https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-endorse-content",
  12: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/intro-to-deployment-pipelines",
  13: "https://learn.microsoft.com/en-us/azure/key-vault/general/overview",
  14: "https://learn.microsoft.com/en-us/power-bi/admin/service-admin-portal-workspace",
  15: "https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-data-lineage",
  // Ciclo de Vida (Q16-Q30)
  16: "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/intro-to-git-integration",
  17: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/intro-to-deployment-pipelines",
  18: "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/git-get-started",
  19: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/pipeline-automation",
  20: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/create-rules",
  21: "https://learn.microsoft.com/en-us/fabric/admin/monitoring-hub",
  22: "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/git-get-started#commit-changes-to-git",
  23: "https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data",
  24: "https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app",
  25: "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/manage-branches",
  26: "https://learn.microsoft.com/en-us/fabric/admin/monitoring-workspace",
  27: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/pipeline-automation",
  28: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/intro-to-deployment-pipelines",
  29: "https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview",
  30: "https://learn.microsoft.com/en-us/fabric/security/security-overview#disaster-recovery",
  // Obter Dados (Q31-Q50)
  31: "https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-onprem",
  32: "https://learn.microsoft.com/en-us/fabric/data-factory/copy-data-activity",
  33: "https://learn.microsoft.com/en-us/fabric/data-factory/create-first-dataflow-gen2",
  34: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts",
  35: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview",
  36: "https://learn.microsoft.com/en-us/fabric/data-factory/activity-overview",
  37: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-notebook-load-data",
  38: "https://learn.microsoft.com/en-us/fabric/data-warehouse/query-warehouse",
  39: "https://learn.microsoft.com/en-us/fabric/data-factory/dataflow-gen2-data-destinations-and-managed-settings",
  40: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-access-api",
  41: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-sql-analytics-endpoint",
  42: "https://learn.microsoft.com/en-us/fabric/data-factory/pipeline-runs",
  43: "https://learn.microsoft.com/en-us/fabric/real-time-intelligence/create-database",
  44: "https://learn.microsoft.com/en-us/fabric/data-engineering/create-custom-spark-pools",
  45: "https://learn.microsoft.com/en-us/fabric/data-factory/activity-overview",
  46: "https://learn.microsoft.com/en-us/fabric/data-factory/create-first-dataflow-gen2",
  47: "https://learn.microsoft.com/en-us/power-query/step-folding-indicators",
  48: "https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing#comparing-fabric-data-warehouse-and-lakehouse",
  49: "https://learn.microsoft.com/en-us/fabric/data-factory/monitor-pipeline-runs",
  50: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-notebook-load-data",
  // Transformar Dados (Q51-Q70)
  51: "https://learn.microsoft.com/en-us/fabric/data-engineering/delta-optimization-and-v-order?tabs=sparksql#optimize",
  52: "https://learn.microsoft.com/en-us/fabric/data-engineering/delta-optimization-and-v-order?tabs=sparksql#vacuum",
  53: "https://learn.microsoft.com/en-us/azure/databricks/delta/merge",
  54: "https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.withColumn.html",
  55: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture",
  56: "https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrameWriter.partitionBy.html",
  57: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-sql-analytics-endpoint",
  58: "https://learn.microsoft.com/en-us/azure/databricks/delta/history",
  59: "https://learn.microsoft.com/en-us/power-query/working-with-duplicates",
  60: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-sql-analytics-endpoint",
  61: "https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.to_date.html",
  62: "https://learn.microsoft.com/en-us/fabric/data-engineering/delta-optimization-and-v-order?tabs=sparksql",
  63: "https://learn.microsoft.com/en-us/azure/databricks/delta/merge",
  64: "https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.fillna.html",
  65: "https://learn.microsoft.com/en-us/fabric/data-warehouse/views",
  66: "https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select-join.html",
  67: "https://learn.microsoft.com/en-us/azure/databricks/delta/update-schema",
  68: "https://learn.microsoft.com/en-us/azure/databricks/delta/delta-change-data-feed",
  69: "https://learn.microsoft.com/en-us/power-query/pivot-columns",
  70: "https://learn.microsoft.com/en-us/azure/databricks/delta/delta-batch#append",
  // Consultar e Analisar (Q71-Q85)
  71: "https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/",
  72: "https://learn.microsoft.com/en-us/dax/totalytd-function-dax",
  73: "https://learn.microsoft.com/en-us/dax/dateadd-function-dax",
  74: "https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select-groupby.html",
  75: "https://learn.microsoft.com/en-us/dax/switch-function-dax",
  76: "https://daxstudio.org/docs/",
  77: "https://learn.microsoft.com/en-us/dax/datesinperiod-function-dax",
  78: "https://learn.microsoft.com/en-us/dax/all-function-dax",
  79: "https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select-window.html",
  80: "https://learn.microsoft.com/en-us/dax/calculate-function-dax",
  81: "https://learn.microsoft.com/en-us/dax/allexcept-function-dax",
  82: "https://learn.microsoft.com/en-us/dax/calendarauto-function-dax",
  83: "https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/ago-function",
  84: "https://learn.microsoft.com/en-us/dax/topn-function-dax",
  85: "https://learn.microsoft.com/en-us/dax/best-practices/dax-variables",
  // Projetar Modelos Semânticos (Q86-Q103)
  86: "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema",
  87: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand",
  88: "https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview",
  89: "https://learn.microsoft.com/en-us/power-bi/guidance/model-date-tables",
  90: "https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview",
  91: "https://learn.microsoft.com/en-us/power-bi/connect-data/service-datasets-across-workspaces",
  92: "https://learn.microsoft.com/en-us/dax/userelationship-function-dax",
  93: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-create-and-manage-relationships#create-a-hierarchy",
  94: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-composite-models",
  95: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-measures#format-a-measure",
  96: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand#cross-filter-direction",
  97: "https://learn.microsoft.com/en-us/power-bi/transform-model/calculation-groups",
  98: "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema#hide-foreign-keys",
  99: "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema#bridge-tables",
  100: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-connect-tools",
  101: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-measures",
  102: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-display-folders",
  103: "https://learn.microsoft.com/en-us/fabric/data-engineering/default-power-bi-semantic-model",
  // Otimizar Modelos Semânticos (Q104-Q120)
  104: "https://learn.microsoft.com/en-us/power-bi/guidance/import-modeling-data-reduction",
  105: "https://daxstudio.org/docs/features/vertipaq-analyzer/",
  106: "https://learn.microsoft.com/en-us/dax/calculate-function-dax",
  107: "https://learn.microsoft.com/en-us/power-bi/enterprise/aggregations-auto",
  108: "https://learn.microsoft.com/en-us/power-bi/guidance/import-modeling-data-reduction",
  109: "https://learn.microsoft.com/en-us/power-bi/connect-data/service-dataset-modes-understand",
  110: "https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview",
  111: "https://learn.microsoft.com/en-us/fabric/data-engineering/delta-optimization-and-v-order",
  112: "https://learn.microsoft.com/en-us/power-bi/guidance/import-modeling-data-reduction#reduce-cardinality",
  113: "https://learn.microsoft.com/en-us/dax/best-practices/dax-variables",
  114: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-large-models",
  115: "https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-performance-analyzer",
  116: "https://learn.microsoft.com/en-us/dax/crossfilter-function",
  117: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-connect-tools",
  118: "https://learn.microsoft.com/en-us/power-bi/guidance/import-modeling-data-reduction#split-date-and-time",
  119: "https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-premium-manage#query-management",
  120: "https://learn.microsoft.com/en-us/power-bi/connect-data/power-bi-data-sources#query-caching",
};

interface QuestionCardProps {
  question: Question;
  language: Language;
  currentIndex: number;
  totalQuestions: number;
  selectedOption: string | null;
  isChecked: boolean;
  onSelectOption: (key: string) => void;
  onCheck: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function QuestionCard({
  question, language, currentIndex, totalQuestions,
  selectedOption, isChecked,
  onSelectOption, onCheck, onNext, onPrevious,
}: QuestionCardProps) {
  const t = translations[language];
  const isCorrect = isChecked && selectedOption === question.correctAnswer;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
      <div
        className={`max-w-3xl mx-auto animate-fade-in rounded-2xl transition-all duration-300 ${
          isChecked
            ? isCorrect
              ? "ring-4 ring-success/60 bg-success/5 shadow-[0_0_40px_-10px_hsl(var(--success)/0.5)] p-4 sm:p-6"
              : "ring-4 ring-destructive/50 bg-destructive/5 p-4 sm:p-6"
            : ""
        }`}
      >
        {/* Question number & category */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-primary">
              {t.question} {currentIndex + 1} {t.of} {totalQuestions}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
              {question.category}
            </span>
          </div>
        </div>

        {/* Scenario + Question */}
        <div className="relative bg-gradient-to-br from-warning/10 via-card to-card rounded-2xl border-2 border-warning/40 p-6 sm:p-8 mb-8 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-warning" />
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-warning mb-3 uppercase tracking-widest">{t.scenario}</h3>
              <p className="text-foreground text-base sm:text-lg leading-relaxed font-medium">
                {question.scenario[language]}
              </p>
            </div>
          </div>

          {/* Question inside scenario frame */}
          <div className="border-t border-warning/20 pt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              {question.question[language]}
            </h2>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectOpt = opt.key === question.correctAnswer;
            let optionClasses = "border-border bg-card hover:bg-option-hover hover:border-primary/30";

            if (isChecked) {
              if (isCorrectOpt) {
                optionClasses = "border-success bg-success/5 ring-1 ring-success/30";
              } else if (isSelected && !isCorrectOpt) {
                optionClasses = "border-destructive bg-destructive/5 ring-1 ring-destructive/30";
              } else {
                optionClasses = "border-border bg-card opacity-50";
              }
            } else if (isSelected) {
              optionClasses = "border-primary bg-option-selected ring-1 ring-primary/30";
            }

            return (
              <button
                key={opt.key}
                onClick={() => !isChecked && onSelectOption(opt.key)}
                disabled={isChecked}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${optionClasses}`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  isChecked && isCorrectOpt
                    ? "bg-success text-success-foreground"
                    : isChecked && isSelected && !isCorrectOpt
                    ? "bg-destructive text-destructive-foreground"
                    : isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {isChecked && isCorrectOpt ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isChecked && isSelected && !isCorrectOpt ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    opt.key
                  )}
                </span>
                <span className="text-foreground font-medium">{opt.text[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isChecked && (
          <div className={`rounded-xl p-5 mb-8 animate-fade-in ${
            isCorrect ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className={`font-semibold ${isCorrect ? "text-success" : "text-destructive"}`}>
                {isCorrect ? t.correct : t.incorrect}
              </span>
            </div>
            <div className="flex items-start gap-2 mt-3">
              <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">{t.explanation}</p>
                <p className="text-sm text-foreground leading-relaxed">{question.explanation[language]}</p>
                {questionDocLinks[question.id] && (
                  <a
                    href={questionDocLinks[question.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {language === "pt-br" ? "Ver documentação Microsoft" :
                     language === "es" ? "Ver documentación Microsoft" :
                     language === "fr" ? "Voir la documentation Microsoft" :
                     "View Microsoft documentation"}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.previous}
          </Button>

          {!isChecked ? (
            <Button
              onClick={onCheck}
              disabled={!selectedOption}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t.checkAnswer}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={currentIndex === totalQuestions - 1}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t.next}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
