using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Sahaya.AIIntelligence.API.DTOs;

namespace Sahaya.AIIntelligence.API.Services
{
    public class HeuristicRuleEngineStrategy : IAIServiceStrategy
    {
        public string StrategyName => "LocalHeuristicRuleEngineFallback";

        public Task<TriageResultDto> EvaluateTriageAsync(TriageRequestDto request, CancellationToken ct = default)
        {
            var combinedText = $"{request.Title} {request.Description} {request.VulnerableDetails}".ToLowerInvariant();

            string priority = "Medium";
            double confidence = 0.82;
            string category = request.Category ?? "Food";
            var rationale = new List<string>();
            var actions = new List<string>();

            // 1. Critical Priority Rules
            if (combinedText.Contains("bleed") || combinedText.Contains("breath") || combinedText.Contains("unconscious") ||
                combinedText.Contains("heart") || combinedText.Contains("drown") || combinedText.Contains("trap") ||
                combinedText.Contains("levee breach") || combinedText.Contains("critical") || combinedText.Contains("තුවාල") ||
                combinedText.Contains("හුස්ම") || combinedText.Contains("හිරවී"))
            {
                priority = "Critical";
                confidence = 0.94;
                category = "MedicalAssistance";
                rationale.Add("Life-threatening indicators detected (severe trauma/submersion risk).");
                actions.Add("Dispatch Immediate 1990 Suwa Seriya / Military Boat Squad");
                actions.Add("Alert closest Regional Hospital Emergency Trauma Bay");
            }
            // 2. High Priority Rules
            else if (combinedText.Contains("infant") || combinedText.Contains("baby") || combinedText.Contains("elderly") ||
                     combinedText.Contains("pregnant") || combinedText.Contains("shelter") || combinedText.Contains("water") ||
                     combinedText.Contains("ළමුන්") || combinedText.Contains("ගැබිනි") || combinedText.Contains("කඳවුර"))
            {
                priority = "High";
                confidence = 0.88;
                if (combinedText.Contains("shelter") || combinedText.Contains("කඳවුර")) category = "EmergencyShelter";
                else if (combinedText.Contains("water") || combinedText.Contains("වතුර")) category = "DrinkingWater";

                rationale.Add("Vulnerable population members present (infants/elderly) or critical safe shelter depletion.");
                actions.Add("Route to nearest available shelter with capacity");
                actions.Add("Dispatch emergency clean water rations within 2 hours");
            }
            // 3. Medium Priority Rules
            else if (combinedText.Contains("food") || combinedText.Contains("dry ration") || combinedText.Contains("clothing") ||
                     combinedText.Contains("කෑම") || combinedText.Contains("ආහාර"))
            {
                priority = "Medium";
                confidence = 0.85;
                category = "Food";
                rationale.Add("Essential survival dry rations requested for sustained community relief.");
                actions.Add("Assign regional volunteer depot pickup token");
            }
            else
            {
                priority = "Low";
                confidence = 0.76;
                category = "Other";
                rationale.Add("Non-critical community request recorded for scheduled regional dispatch.");
                actions.Add("Queue in secondary logistics triage pipeline");
            }

            if (request.AffectedCount > 5)
            {
                rationale.Add($"Large group impact factor: {request.AffectedCount} individuals reported.");
                if (priority == "Medium") priority = "High";
            }

            var result = new TriageResultDto
            {
                Id = Guid.NewGuid(),
                RequestId = request.RequestId ?? Guid.NewGuid(),
                PredictedCategory = category,
                RecommendedPriority = priority,
                ConfidenceScore = Math.Round(confidence, 3),
                RationaleText = string.Join(" ", rationale),
                SuggestedActions = actions,
                GeneratedAtUtc = DateTime.UtcNow
            };

            return Task.FromResult(result);
        }

        public Task<AIChatResponseDto> ProcessChatAsync(AIChatRequestDto request, CancellationToken ct = default)
        {
            var lower = (request.Message ?? string.Empty).ToLowerInvariant();
            var isSi = (request.Language ?? string.Empty).ToLowerInvariant().StartsWith("si") ||
                       lower.Contains("ආයුබෝවන්") || lower.Contains("කඳවුර") || lower.Contains("කෑම") || lower.Contains("උදව්");

            string reply;
            var suggestions = new List<string>();

            if (lower.Contains("shelter") || lower.Contains("stay") || lower.Contains("evacuat") ||
                lower.Contains("කඳවුර") || lower.Contains("නවාතැන්"))
            {
                reply = isSi
                    ? "SAHAYA පද්ධතිය සක්‍රීය සහන කඳවුරු, පානීය ජලය සහ වෛද්‍ය පහසුකම් පිළිබඳ තොරතුරු සජීවීව පවත්වාගෙන යයි. අපගේ Interactive Map එකෙන් හෝ 'Submit Request' හරහා ආරක්ෂිත කඳවුරක් ඉල්ලා සිටිය හැක."
                    : "SAHAYA maintains real-time records of active emergency shelters with verified water, medical bays, and capacity. You can view all nearby shelters on our interactive map or request emergency shelter through the Submit Request portal.";

                suggestions.AddRange(isSi
                    ? new[] { "ළඟම කඳවුර කොහෙද?", "කඳවුරක් ඉල්ලන්නේ කොහොමද?", "කඳවුරුවල කෑම තියෙනවද?" }
                    : new[] { "Where is the nearest shelter?", "How do I request shelter?", "Is food provided at shelters?" });
            }
            else if (lower.Contains("medic") || lower.Contains("injur") || lower.Contains("doctor") ||
                     lower.Contains("බෙහෙත්") || lower.Contains("තුවාල") || lower.Contains("රෝහල"))
            {
                reply = isSi
                    ? "ජීවිත අවදානම් සහිත හදිසි අවස්ථාවලදී කරුණාකර ජාතික හදිසි ගිලන්රථ සේවාව (1990 සුවසැරිය) හෝ පොලිස් හදිසි ඇමතුම් (119) වහාම අමතන්න. SAHAYA හරහා Critical මට්ටමේ 'Medical Assistance' ඉල්ලීමක් යොමු කරන්න."
                    : "For life-threatening medical emergencies, please call national emergency services immediately (119 / 1990). Within SAHAYA, submit a Medical Assistance request marked Critical to trigger immediate coordinator review.";

                suggestions.AddRange(isSi
                    ? new[] { "හදිසි වෛද්‍ය ආධාර ඉල්ලන්න", "ළඟම වෛද්‍ය මධ්‍යස්ථානය", "හදිසි දුරකථන අංක" }
                    : new[] { "Request medical aid", "Locate emergency clinic", "Emergency hotline numbers" });
            }
            else if (lower.Contains("food") || lower.Contains("water") || lower.Contains("ration") ||
                     lower.Contains("කෑම") || lower.Contains("ආහාර") || lower.Contains("වතුර"))
            {
                reply = isSi
                    ? "ආපදාවට ලක්වූ ප්‍රදේශ සඳහා හදිසි ආහාර සලාක සහ පිරිසිදු පානීය ජලය බෙදාහැරීම ක්‍රියාත්මක වේ. පුරවැසියන්ට තම පවුලේ සාමාජික ගණන ඇතුළත් කර සහන ඉල්ලීමක් ඉදිරිපත් කළ හැක."
                    : "Emergency food rations and clean drinking water containers are being coordinated across active disaster zones. Citizens can submit an assistance request specifying their household headcount.";

                suggestions.AddRange(isSi
                    ? new[] { "ආහාර සලාක ඉල්ලන්න", "ජලය බෙදාහරින ස්ථාන", "ඉල්ලීමේ තත්ත්වය පරීක්ෂා කරන්න" }
                    : new[] { "Request food rations", "Find water distribution point", "Check request status" });
            }
            else if (lower.Contains("volunteer") || lower.Contains("help") || lower.Contains("ස්වේච්ඡා") || lower.Contains("උදව් කරන්න"))
            {
                reply = isSi
                    ? "උදව් කිරීමට ඉදිරිපත් වීම පිළිබඳව ස්තූතියි! ලියාපදිංචි ස්වේච්ඡා සේවකයන්ට ප්‍රථමාධාර, සෙවීම් සහ මුදාගැනීම් ආදී ක්ෂේත්‍ර තෝරාගත හැක. අනුමත වූ පසු ඔබේ Dashboard එකට මෙහෙයුම් විස්තර ලැබේ."
                    : "Thank you for your willingness to help! Registered volunteers can specify skills such as First Aid, Search & Rescue, Logistics, and Medical aid. Once approved, coordinators dispatch tasks directly to your dashboard.";

                suggestions.AddRange(isSi
                    ? new[] { "ස්වේච්ඡා සේවයට එක්වන්න", "විවෘත මෙහෙයුම් බලන්න", "සම්බන්ධීකාරක අමතන්න" }
                    : new[] { "Register as volunteer", "View open missions", "Contact coordinator" });
            }
            else
            {
                reply = isSi
                    ? "ආයුබෝවන්! මම SAHAYA AI සහායකයා වෙමි. සහන ඉල්ලීම් ඉදිරිපත් කිරීම, ආරක්ෂිත කඳවුරු සෙවීම, ආහාර/වතුර සහන ලබාගැනීම හෝ ස්වේච්ඡා සේවයට එක්වීම සඳහා මට ඔබට මඟපෙන්විය හැක. මට ඔබට උදව් කළ හැක්කේ කෙසේද?"
                    : "Hello! I am SAHAYA AI Crisis Assistant. I can help guide you through submitting assistance requests, finding verified shelters, checking distribution hubs, or connecting with emergency coordinators. How can I assist you right now?";

                suggestions.AddRange(isSi
                    ? new[] { "ළඟම කඳවුර කොහෙද?", "හදිසි ආහාර සලාක ඉල්ලන්නේ කොහොමද?", "හදිසි ඇමතුම් අංක", "ස්වේච්ඡා සේවයට එක්වන්න" }
                    : new[] { "Where is the nearest shelter?", "How do I request emergency rations?", "Emergency hotline contacts", "Register as a volunteer" });
            }

            var response = new AIChatResponseDto
            {
                Reply = reply,
                IsFromFallback = true,
                QuickSuggestions = suggestions,
                SessionId = string.IsNullOrWhiteSpace(request.SessionId) ? Guid.NewGuid().ToString("N")[..8] : request.SessionId
            };

            return Task.FromResult(response);
        }
    }
}
