import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { categories as mockCategories } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "请输入工具名称").max(50),
  url: z.string().trim().min(1, "请输入官网链接").url("请输入有效的URL地址"),
  tagline: z.string().trim().min(1, "请输入一句话介绍").max(80, "最多80字"),
  category: z.string().min(1, "请选择分类"),
  pricingType: z.enum(["free", "freemium", "paid", "opensource"], { required_error: "请选择收费类型" }),
  chinaAvailable: z.enum(["yes", "no"], { required_error: "请选择是否国内可用" }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SubmitTool() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // 先使用 mock 数据，确保页面不会空白
  const [categories, setCategories] = useState(mockCategories);
  const [dataSource, setDataSource] = useState<'mock' | 'supabase'>('mock');
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", url: "", tagline: "", category: "", notes: "" },
  });

  const taglineValue = form.watch("tagline") || "";

  // 组件加载后尝试从 Supabase 获取分类数据
  useEffect(() => {
    async function loadCategories() {
      try {
        console.log('正在从Supabase加载分类数据...')
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order')
        
        if (error) {
          console.log('Supabase加载分类失败，使用mock数据:', error)
          return
        }
        
        if (data && data.length > 0) {
          console.log('Supabase加载分类成功，共', data.length, '个分类')
          setCategories(data as any)
          setDataSource('supabase')
        } else {
          console.log('Supabase返回空分类数据，使用mock数据')
        }
      } catch (err) {
        console.log('Supabase连接失败，使用mock数据:', err)
      }
    }
    
    loadCategories()
  }, [])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    
    try {
      console.log('正在提交工具到数据库:', data.name)
      
      const submitData = {
        name: data.name,
        website_url: data.url,
        tagline: data.tagline,
        category: data.category,
        pricing_type: data.pricingType,
        is_china_available: data.chinaAvailable === 'yes',
        note: data.notes
      };
      
      const { data: result, error } = await supabase
        .from('tool_submissions')
        .insert([submitData])
        .select()
      
      if (error) {
        console.log('提交失败:', error)
        toast({
          title: "提交失败",
          description: error.message || "请稍后重试",
          variant: "destructive"
        });
        return
      }
      
      console.log('提交成功:', result)
      setSubmitted(true);
      toast({
        title: "提交成功！",
        description: "我们将在24小时内审核"
      });
    } catch (err) {
      console.log('提交异常:', err)
      toast({
        title: "提交失败",
        description: "网络异常，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    form.reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>提交工具 - AI创客</title>
          <meta name="description" content="提交AI工具收录 - AI创客" />
        </Helmet>
        <main className="mx-auto max-w-[640px] px-6 pt-24 pb-12">
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold">提交成功！</h2>
            <p className="text-muted-foreground mt-2 text-center">
              我们将在24小时内审核，审核通过后自动上线。
            </p>
            <div className="flex gap-3 mt-6">
              <Button onClick={reset} variant="outline">继续提交</Button>
              <Link to="/"><Button className="bg-gradient-primary text-white">返回首页</Button></Link>
            </div>
          </CardContent>
        </Card>
      </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>提交工具 - AI创客</title>
        <meta name="description" content="提交AI工具收录 - AI创客" />
      </Helmet>
      <main className="mx-auto max-w-[640px] px-6 pt-24 pb-12">
      {/* 数据来源指示器 */}
      <div className="text-xs text-muted-foreground mb-4 text-right">
        数据源: {dataSource === 'supabase' ? '🟢 Supabase' : '🟡 Mock'}
      </div>
      <div className="mb-4">
        <Link to="/" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors">
          ← 返回AI导航
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-1">💡 提交AI工具收录</h1>
      <p className="text-muted-foreground mb-6">发现了好用的AI工具？提交给我们，审核通过后将上线。</p>

      <Card>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>工具名称 *</FormLabel>
                  <FormControl><Input placeholder="例如：ChatGPT" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem>
                  <FormLabel>官网链接 *</FormLabel>
                  <FormControl><Input placeholder="https://www.example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="tagline" render={({ field }) => (
                <FormItem>
                  <FormLabel>一句话介绍 *</FormLabel>
                  <FormControl><Input placeholder="用一句话描述这个工具的核心功能" {...field} /></FormControl>
                  <div className="text-xs text-muted-foreground text-right">{taglineValue.length}/80</div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>所属分类 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.filter((c) => c.id !== "all").map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="pricingType" render={({ field }) => (
                <FormItem>
                  <FormLabel>收费类型 *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      {[
                        { value: "free", label: "免费" },
                        { value: "freemium", label: "免费增值" },
                        { value: "paid", label: "付费" },
                        { value: "opensource", label: "开源" },
                      ].map((o) => (
                        <div key={o.value} className="flex items-center gap-1.5">
                          <RadioGroupItem value={o.value} id={`pricing-${o.value}`} />
                          <Label htmlFor={`pricing-${o.value}`} className="text-sm">{o.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="chinaAvailable" render={({ field }) => (
                <FormItem>
                  <FormLabel>国内是否可用 *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <RadioGroupItem value="yes" id="china-yes" />
                        <Label htmlFor="china-yes" className="text-sm">国内可直接用</Label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RadioGroupItem value="no" id="china-no" />
                        <Label htmlFor="china-no" className="text-sm">需要翻墙</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>补充说明</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="关于这个工具的更多信息（选填）" {...field} />
                  </FormControl>
                </FormItem>
              )} />

              <Button type="submit" className="w-full bg-gradient-primary text-white h-11 text-base" disabled={submitting}>
                {submitting ? "提交中..." : "提交"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
    </>
  );
}
