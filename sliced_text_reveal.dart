import 'package:flutter/material.dart';

/// A sliced text reveal component for Agence Aura.
/// It uses a clipping mask to make the text appear to "emerge" as the user scrolls.
class SlicedTextReveal extends StatefulWidget {
  final String text;
  final TextStyle style;
  final ScrollController scrollController;

  const SlicedTextReveal({
    super.key,
    required this.text,
    required this.style,
    required this.scrollController,
  });

  @override
  State<SlicedTextReveal> createState() => _SlicedTextRevealState();
}

class _SlicedTextRevealState extends State<SlicedTextReveal> {
  double _revealProgress = 0.0;
  final GlobalKey _widgetKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    // Listen to scroll notifications to calculate reveal progress
    widget.scrollController.addListener(_calculateReveal);
  }

  @override
  void dispose() {
    widget.scrollController.removeListener(_calculateReveal);
    super.dispose();
  }

  void _calculateReveal() {
    if (!mounted) return;

    final RenderBox? renderBox = _widgetKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox == null) return;

    final position = renderBox.localToGlobal(Offset.zero);
    final screenHeight = MediaQuery.of(context).size.height;
    
    // Calculate progress: 0.0 when at the bottom of the screen, 1.0 when near the middle/top
    final startRevealAt = screenHeight * 0.95; // Start revealing when 5% enters screen
    final fullRevealAt = screenHeight * 0.5;   // Fully revealed at 50% screen height

    double progress = (startRevealAt - position.dy) / (startRevealAt - fullRevealAt);
    
    // Clamp between 0.0 and 1.0
    progress = progress.clamp(0.0, 1.0);

    if (progress != _revealProgress) {
      setState(() {
        _revealProgress = progress;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // We use a Stack inside a ClipRect to create the "mask" effect.
    // The text will be translated from 'below' the mask to its original position.
    
    return RepaintBoundary(
      key: _widgetKey,
      child: ClipRect(
        child: Container(
          padding: const EdgeInsets.only(bottom: 5.0), // Extra space for decenders
          child: Stack(
            children: [
              // Placeholder for layout (invisible text)
              Text(
                widget.text,
                style: widget.style.copyWith(color: Colors.transparent),
              ),
              // The animated text
              Transform.translate(
                // At progress 0, it's 100% down (invisible)
                // At progress 1, it's 0% down (fully visible)
                offset: Offset(0, (1.0 - _revealProgress) * 120.0), 
                child: Opacity(
                  opacity: _revealProgress.clamp(0.1, 1.0),
                  child: Text(
                    widget.text,
                    style: widget.style,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A wrapper that uses NotificationListener<ScrollNotification> as requested
/// to manage multiple SlicedTextReveal widgets or similar logic.
class SlicedScrollWrapper extends StatelessWidget {
  final Widget child;
  final Function(ScrollNotification) onNotification;

  const SlicedScrollWrapper({
    super.key,
    required this.child,
    required this.onNotification,
  });

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (notification) {
        onNotification(notification);
        return false; // Allow bubble up
      },
      child: child,
    );
  }
}

/// Example of how to use it in a Page
class AuraLandingDemo extends StatefulWidget {
  const AuraLandingDemo({super.key});

  @override
  State<AuraLandingDemo> createState() => _AuraLandingDemoState();
}

class _AuraLandingDemoState extends State<AuraLandingDemo> {
  final ScrollController _scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030305),
      body: SingleChildScrollView(
        controller: _scrollController,
        child: Column(
          children: [
            // Hero Placeholder
            Container(height: 1000, color: Colors.transparent),
            
            // The Sliced Text Component
            Padding(
              padding: const EdgeInsets.all(40.0),
              child: SlicedTextReveal(
                scrollController: _scrollController,
                text: "Damos vida a ideas extraordinarias.",
                style: const TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 80,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  letterSpacing: -2,
                ),
              ),
            ),

            Container(height: 1000, color: Colors.transparent),
          ],
        ),
      ),
    );
  }
}
