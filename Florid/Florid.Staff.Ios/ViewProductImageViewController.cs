using System;
using System.Threading.Tasks;
using CoreGraphics;
using Foundation;
using UIKit;

namespace Florid.Staff.Ios
{
    public partial class ViewProductImageViewController : UIViewController
    {
        UIScrollView scrollView;
        UIImageView imageView;
        string _url;
        bool _isLoaded = false;

        public ViewProductImageViewController(string url) : base("ViewProductImageViewController", null)
        {
            _url = url;
        }
        public override void ViewDidLoad()
        {
            // Perform any additional setup after loading the view, typically from a nib.

            this.View.BackgroundColor = UIColor.White;


            this.Title = "Scroll View";

            scrollView = new UIScrollView(
                new CGRect(0, 0, View.Frame.Width
                , View.Frame.Height));

            View.AddSubview(scrollView);

            imageView = new UIImageView();
            scrollView.ContentSize = new CGSize(View.Frame.Width, View.Frame.Height);
            imageView.Frame = new CGRect(0, 0, 300, 400);

            scrollView.AddSubview(imageView);
            scrollView.BackgroundColor = UIColor.FromName(IOSConstants.COLOR_BACKGROUND);

            //SCROLL VIEW ZOOM
            scrollView.MaximumZoomScale = 3f;
            scrollView.MinimumZoomScale = .1f;

            scrollView.ViewForZoomingInScrollView += (UIScrollView sv) => { return imageView; };

            // TAP GESTURE
            UITapGestureRecognizer doubletap = new UITapGestureRecognizer(OnDoubleTap)
            {
                NumberOfTapsRequired = 2 //NUMBER OF TAPS
            };
            scrollView.AddGestureRecognizer(doubletap); // detect when the scrollView is double-tapped

        }

        private void OnDoubleTap(UIGestureRecognizer gesture)
        {
            if (scrollView.ZoomScale >= 1)
                scrollView.SetZoomScale(0.5f, true);
            else
                scrollView.SetZoomScale(3f, true);
        }

        public override async void ViewDidAppear(bool animated)
        {
            base.ViewDidAppear(animated);

            if (_isLoaded)
                return;

            scrollView.Frame = new CGRect(0, 0, View.Frame.Width, View.Frame.Height);
            _isLoaded = true;

            imageView.Image = await FromUrl(_url);

            if (imageView.Image.Size.Width > imageView.Image.Size.Height)
            {
                imageView.Frame = new CGRect(0, 30, View.Frame.Width, View.Frame.Width - 100);
            }
            else
            {
                imageView.Frame = new CGRect(0, 30, View.Frame.Width, View.Frame.Width + 100);
            }

            var button = new UIButton(new CGRect(16, View.Frame.Height - 55, View.Frame.Width - 2 * 16, 50));

            button.Layer.BackgroundColor = UIColor.FromName(IOSConstants.COLOR_MAIN).CGColor;
            button.Layer.CornerRadius = 8;
            button.SetTitle("Trở về", UIControlState.Normal);
            button.SetTitleColor(UIColor.White, UIControlState.Normal);

            View.AddSubview(button);

            button.TouchUpInside += delegate
            {
                this.DismissModalViewController(true);
                GC.Collect();
            };

        }

        public async Task<UIImage> FromUrl(string imageUrl)
        {
            return await Task.Run<UIImage>(() =>
            {
                try
                {
                    using (var url = new NSUrl(imageUrl))
                    {
                        using (var data = NSData.FromUrl(url))
                        {
                            return UIImage.LoadFromData(data);
                        }
                    }

                }
                catch
                {
                    return null;
                }

            });

        }
    }
}

