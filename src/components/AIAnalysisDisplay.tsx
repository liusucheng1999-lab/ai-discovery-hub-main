import { Brain, Target, Lightbulb, CheckCircle } from "lucide-react";

interface AIAnalysisData {
  query_understanding: string;
  search_intent: string;
  summary: string;
  total_analyzed: number;
  high_confidence_matches: number;
}

interface AIAnalysisDisplayProps {
  analysis?: AIAnalysisData;
  hasMatches: boolean;
  searchQuery: string;
}

export default function AIAnalysisDisplay({ analysis, hasMatches, searchQuery }: AIAnalysisDisplayProps) {
  if (!analysis) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI分析过程</h3>
        {hasMatches ? (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">已匹配</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
            <span className="text-sm">未匹配到高相关度工具</span>
          </div>
        )}
      </div>

      <div className="space-y-3 text-sm">
        {/* 查询理解 */}
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">查询理解</div>
            <div className="text-blue-700 dark:text-blue-300">{analysis.query_understanding}</div>
          </div>
        </div>

        {/* 搜索意图 */}
        <div className="flex items-start gap-2">
          <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">搜索意图</div>
            <div className="text-blue-700 dark:text-blue-300">{analysis.search_intent}</div>
          </div>
        </div>

        {/* 分析总结 */}
        {analysis.summary && (
          <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-800/50">
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">分析总结</div>
            <div className="text-blue-700 dark:text-blue-300">{analysis.summary}</div>
          </div>
        )}

        {/* 匹配统计 */}
        <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
            <span>分析了 {analysis.total_analyzed || 0} 个工具</span>
            <span>
              {hasMatches 
                ? `找到 ${analysis.high_confidence_matches || 0} 个匹配度超过60%的工具` 
                : '未找到匹配度超过60%的工具'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
