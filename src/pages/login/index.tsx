import { Layout } from '@/components/layout';
import { getUserInfo, postUserLogin } from '@/apis/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { userStore } from '@/store/user';
import { encodeToken } from '@/lib/token';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { setToken, setUserInfo } = userStore();

    const loginForm = z.object({
        phone: z
            .string({
                required_error: t('login.phone.empty')
            })
            .regex(/^1[3456789]\d{9}$/, {
                message: t('login.phone.rule')
            }),
        password: z.string({
            required_error: t('login.password.empty')
        })
    });

    const form = useForm<z.infer<typeof loginForm>>({
        resolver: zodResolver(loginForm),
        defaultValues: {
            phone: '',
            password: ''
        }
    });

    const onLogin = async (values: z.infer<typeof loginForm>) => {
        try {
            const {
                data: { token }
            } = await postUserLogin(values);
            setToken(encodeToken(token));
            const { data } = await getUserInfo();
            setUserInfo({
                nickName: data.nickName,
                phone: data.phone
            });
            toast({
                description: t('login.success'),
                duration: 1500
            });
            navigate('/', {
                replace: true
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout className="h-full items-center justify-center">
            <Card className="w-80 sm:w-96">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">
                        {t('login.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onLogin)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('login.phone')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="phone"
                                                autoComplete=""
                                                placeholder="+86"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('login.password')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                autoComplete=""
                                                placeholder={t(
                                                    'login.password.placeholder'
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="confirm"
                                className="w-full"
                                type="submit"
                            >
                                {t('login.button')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Login;
